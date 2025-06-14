import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../core/services/category.service';
import { SoundService } from '../../core/services/sound.service';
import { InstSoundsService } from '../../core/services/ints-sounds.service';
import { InstrumentalService } from '../../core/services/instrumental.service';
import { Category } from '../../models/category';
import { Sound } from '../../models/sound';
import { Instrumental } from '../../models/instrumental';
import { environment } from '../../../environments/environment';
import { Step } from '../../models/step';
import { CategoryRow } from '../../models/categoryRow';
import { firstValueFrom } from 'rxjs';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-public-sequencer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './public-sequencer.component.html',
  styleUrls: ['./public-sequencer.component.scss'],
})
export class PublicSequencerComponent implements OnInit, OnDestroy {
  rows: CategoryRow[] = [];
  categories: Category[] = [];
  sounds: (Sound & { buffer?: AudioBuffer })[] = [];
  instrumental!: Instrumental;
  bpm: number = 120;
  currentStep = 0;
  isPlaying = false;
  interval: any;
  audioContext = new AudioContext();
  environment = environment;
  constructor(
    private categoryService: CategoryService,
    private soundService: SoundService,
    private instSoundService: InstSoundsService,
    private instrumentalService: InstrumentalService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const instrumentalId = Number(this.route.snapshot.paramMap.get('instrumentalId'));
    if (isNaN(instrumentalId)) {
      this.router.navigate(['/public']); // Cambio a /public
      return;
    }

    this.instrumentalService.getInstrumentalById(instrumentalId).subscribe({
      next: (instr) => {
        console.log('Instrumental recibido:', instr);

        // Usamos 'public' pero con acceso seguro
        if (!instr || !instr.public) {
          this.router.navigate(['/public']); // Redirige a /public si no es público o no existe
          return;
        }

        this.instrumental = instr;
        this.bpm = parseInt(instr.bpm, 10) || 120;

        this.instSoundService.getSequencerSteps(instr.id!).subscribe({
          next: (steps) => this.loadSequencerData(steps),
          error: (err) => {
            console.error('Error al cargar pasos', err);
            this.router.navigate(['/public']);
          },
        });
      },
      error: (err) => {
        console.error('Error al cargar instrumental', err);
        this.router.navigate(['/public']);
      },
    });
  }

  ngOnDestroy(): void {
    this.stopSequence();
  }

  async loadSequencerData(steps: Step[]) {
    this.categories = await this.categoryService.getCategoriesSequencer().toPromise();
    const allSounds = await firstValueFrom(this.soundService.getSequencerSounds());
    if (!allSounds) {
      console.error('No se pudieron obtener los sonidos');
      return;
    }

    this.sounds = await Promise.all(
      allSounds.map(async (sound) => ({
        ...sound,
        buffer: await this.loadSoundBuffer(sound.soundPath),
      }))
    );

    this.buildRowsFromSteps(steps);
  }

  async loadSoundBuffer(path: string): Promise<AudioBuffer> {
    const response = await fetch(`${environment.apiUrl}/uploads/${path}`);
    const arrayBuffer = await response.arrayBuffer();
    return this.audioContext.decodeAudioData(arrayBuffer);
  }

  buildRowsFromSteps(steps: Step[]): void {
    const rowsMap = new Map<number, CategoryRow>();

    for (const step of steps) {
      const sound = this.sounds.find((s) => s.id === step.soundId);
      if (!sound) continue;

      const category = this.categories.find((c) => c.id === sound.category.id);
      if (!category) continue;

      if (!rowsMap.has(category.id!)) {
        rowsMap.set(category.id!, {
          category,
          sounds: this.sounds.filter((s) => s.category.id === category.id),
          selectedSound: sound,
          steps: Array(12).fill(null).map(() => ({ active: false })),
        });
      }

      const row = rowsMap.get(category.id!)!;
      step.steps.forEach((isActive, index) => {
        row.steps[index] = { active: isActive };
      });
    }

    // Añadir categorías sin pasos
    for (const category of this.categories) {
      if (!rowsMap.has(category.id!)) {
        rowsMap.set(category.id!, {
          category,
          sounds: this.sounds.filter((s) => s.category.id === category.id),
          selectedSound: null,
          steps: Array(12).fill(null).map(() => ({ active: false })),
        });
      }
    }

    this.rows = Array.from(rowsMap.values());
  }

  togglePlay(): void {
    this.isPlaying = !this.isPlaying;
    this.isPlaying ? this.startSequence() : this.stopSequence();
  }

  startSequence(): void {
    this.stopSequence();
    const intervalMs = (60 / this.bpm) * 1000;

    this.interval = setInterval(() => {
      this.currentStep = (this.currentStep + 1) % 12;

      for (const row of this.rows) {
        const step = row.steps[this.currentStep];
        if (step.active && row.selectedSound?.buffer) {
          const source = this.audioContext.createBufferSource();
          source.buffer = row.selectedSound.buffer!;
          source.connect(this.audioContext.destination);
          source.start();
        }
      }
    }, intervalMs);
  }

  stopSequence(): void {
    if (this.interval) {
      clearInterval(this.interval);
      this.interval = null;
    }
  }

  get coverFullUrl(): string {
    if (!this.instrumental || !this.instrumental.coverUrl) return '';
    return `${environment.apiUrl}/uploads/${this.instrumental.coverUrl}`;
  }
}