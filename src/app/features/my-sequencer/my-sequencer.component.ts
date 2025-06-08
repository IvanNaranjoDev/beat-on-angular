import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryRow } from '../../models/categoryRow';
import { Category } from '../../models/category';
import { Sound } from '../../models/sound';
import { SoundService } from '../../core/services/sound.service';
import { CategoryService } from '../../core/services/category.service';
import { InstrumentalService } from '../../core/services/instrumental.service';
import { AuthService } from '../../core/services/auth.service';
import { environment } from '../../../environments/environment';
import { InstSoundsService } from '../../core/services/ints-sounds.service';
import { Instrumental } from '../../models/instrumental';
import { Step } from '../../models/step';

@Component({
  selector: 'app-my-sequencer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './my-sequencer.component.html',
  styleUrls: ['./my-sequencer.component.scss']
})
export class MySequencerComponent implements OnInit, OnDestroy {
  rows: CategoryRow[] = [];
  categories: Category[] = [];
  sounds: (Sound & { buffer?: AudioBuffer })[] = [];
  currentStep = 0;
  interval: any;
  isPlaying = false;
  instrumentalId!: number;
  instrumental!: Instrumental;

  instName: string = '';
  public: boolean = false;
  coverFile: File | null = null;
  currentCoverUrl: string | null = null;
  bpmOptions = [80, 100, 120, 130, 140, 170];
  bpm = 120;

  private audioContext = new AudioContext();

  constructor(
    private authService: AuthService,
    private soundService: SoundService,
    private instrumentalService: InstrumentalService,
    private categoryService: CategoryService,
    private instSoundService: InstSoundsService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.params['instrumentalId'];
    this.instrumentalId = Number(idParam);

    if (isNaN(this.instrumentalId)) {
      console.error('ID de instrumental no válido:', idParam);
      this.router.navigate(['/my-instrumentals']);
      return;
    }

    this.loadInstrumental();
  }

  ngOnDestroy() {
    this.stopSequence();
  }

  loadInstrumental(): void {
    this.instrumentalService.getInstrumentalById(this.instrumentalId).subscribe({
      next: (instrumental) => {
        this.instrumental = instrumental;
        this.instName = instrumental.instName;
        this.public = instrumental.public;
        this.bpm = parseInt(instrumental.bpm, 10);
        this.currentCoverUrl = instrumental.coverUrl 
          ? environment.apiUrl + '/uploads/' + instrumental.coverUrl 
          : null;

        this.instSoundService.getSequencerSteps(this.instrumentalId).subscribe({
          next: (sequencerRows: Step[]) => {
            this.loadCategoriesAndSounds(sequencerRows);
          },
          error: (err) => {
            console.error('Error cargando los pasos de la instrumental:', err);
          }
        });
      },
      error: (err) => {
        console.error('Error loading instrumental:', err);
      }
    });
  }

  async loadCategoriesAndSounds(sequencerRows: Step[]): Promise<void> {
    this.categoryService.getCategoriesSequencer().subscribe(categories => {
      this.categories = categories;

      this.soundService.getSequencerSounds().subscribe(async sounds => {
        this.sounds = await Promise.all(sounds.map(async sound => {
          const soundUrl = environment.apiUrl + '/uploads/' + sound.soundPath;
          const buffer = await this.loadAudioBuffer(soundUrl);
          return { ...sound, buffer };
        }));

        // Mapeo de rows por category.id
        const rowsMap = new Map<number, CategoryRow>();

        // Primero, por cada row del secuenciador cargado, arma la fila
        sequencerRows.forEach(rowDTO => {
          const sound = this.sounds.find(s => s.id === rowDTO.soundId);
          if (!sound || sound.category.id === undefined) return;

          const category = this.categories.find(c => c.id === sound.category.id);
          if (!category) return;

          const soundsForCategory = this.sounds.filter(s => s.category.id === category.id);

          rowsMap.set(category.id!, {
            category,
            sounds: soundsForCategory,
            selectedSound: sound,
            steps: rowDTO.steps.map(active => ({ active }))
          });
        });

        // Ahora agregamos todas las categorías que no estén en el map, con steps vacíos y sin sonido seleccionado
        this.categories.forEach(category => {
          if (category.id === undefined) return;

          if (!rowsMap.has(category.id)) {
            const soundsForCategory = this.sounds.filter(s => s.category.id === category.id);
            rowsMap.set(category.id, {
              category,
              sounds: soundsForCategory,
              selectedSound: null,
              steps: Array(12).fill(null).map(() => ({ active: false })) // 12 pasos vacíos
            });
          }
        });

        // Finalmente asigna el array de filas para el template
        this.rows = Array.from(rowsMap.values());
      });
    });
  }

  volver() {
    this.router.navigate(['/my-instrumentals']);
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.coverFile = file;
    }
  }

  async loadAudioBuffer(url: string): Promise<AudioBuffer> {
    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    return await this.audioContext.decodeAudioData(arrayBuffer);
  }

  toggleStep(row: number, col: number) {
    this.rows[row].steps[col].active = !this.rows[row].steps[col].active;
  }

  togglePlay() {
    this.isPlaying = !this.isPlaying;
    if (this.isPlaying) {
      this.startSequence();
    } else {
      this.stopSequence();
    }
  }

  startSequence() {
    this.stopSequence();
    const stepDuration = (60 / this.bpm) * 1000;

    this.interval = setInterval(() => {
      this.currentStep = (this.currentStep + 1) % 12;

      for (let i = 0; i < this.rows.length; i++) {
        const row = this.rows[i];
        const step = row.steps[this.currentStep];

        if (step.active && row.selectedSound?.buffer) {
          this.playSound(row.selectedSound.buffer!);
        }
      }
    }, stepDuration);
  }

  stopSequence() {
    clearInterval(this.interval);
    this.interval = null;
  }

  onBpmChange() {
    if (this.isPlaying) {
      this.startSequence();
    }
  }

  playSound(buffer: AudioBuffer) {
    const source = this.audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(this.audioContext.destination);
    source.start();
  }

  updateInstrumental(): void {
    this.authService.getUserId().subscribe({
      next: (data) => {
        const userId = data.userId;

        const steps: Step[] = this.rows
          .map((row, rowIndex) => {
            if (!row.selectedSound) return null;

            const stepData = row.steps.map(step => step.active);
            if (!stepData.includes(true)) return null;

            return {
              soundId: row.selectedSound.id,
              rowIndex,
              steps: stepData
            };
          })
          .filter((row): row is Step => row !== null);

        const dto = {
          id: this.instrumentalId,
          instName: this.instName,
          bpm: this.bpm.toString(),
          public: this.public,
          userId: userId,
          steps: steps
        };

        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

        if (this.coverFile) {
          formData.append('coverUrl', this.coverFile);
        }

        this.instrumentalService.updateInstrumental(this.instrumentalId, formData).subscribe({
          next: () => {
            this.instSoundService.updateInstSounds(this.instrumentalId, steps).subscribe({
              next: () => {
                console.log('Instrumental y posiciones actualizadas correctamente');
                this.router.navigate(['/my-instrumentals']);
              },
              error: (err) => {
                console.error('Error al actualizar posiciones:', err);
              }
            });
          },
          error: (err) => {
            console.error('Error al actualizar el instrumental:', err);
          }
        });
      },
      error: err => {
        console.error('Error al obtener el userId:', err);
      }
    });
  }

  removeCover(): void {
    this.coverFile = null;
    this.currentCoverUrl = null;
  }

  deleteInstrumental(): void {
    if (confirm('¿Estás seguro de que quieres eliminar esta instrumental?')) {
      this.instrumentalService.deleteInstrumental(this.instrumentalId).subscribe({
        next: () => {
          this.router.navigate(['/my-instrumentals']);
        },
        error: (err) => {
          console.error('Error al eliminar la instrumental:', err);
        }
      });
    }
  }
}
