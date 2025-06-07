import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CategoryRow } from '../../models/categoryRow';
import { Category } from '../../models/category';
import { Sound } from '../../models/sound';
import { SoundService } from '../../core/services/sound.service';
import { CategoryService } from '../../core/services/category.service';
import { environment } from '../../../environments/environment';
import { InstrumentalService } from '../../core/services/instrumental.service';
import { AuthService } from '../../core/services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-sequencer',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sequencer.component.html',
  styleUrls: ['./sequencer.component.scss']
})
export class SequencerComponent implements OnInit, OnDestroy {
  rows: CategoryRow[] = [];
  categories: Category[] = [];
  sounds: (Sound & { buffer?: AudioBuffer })[] = [];
  currentStep = 0;
  interval: any;
  isPlaying = false;

  instName: string = '';
  isPublic: boolean = false;
  coverFile: File | null = null;
  bpmOptions = [80, 100, 120, 130, 140, 170];
  bpm = 120;

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.coverFile = file;
    }
  }

  private audioContext = new AudioContext();

  constructor(
    private authService: AuthService,
    private soundService: SoundService,
    private instrumentalService: InstrumentalService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadCategoriesAndSounds();
  }

  ngOnDestroy() {
    this.stopSequence();
  }

  async loadCategoriesAndSounds(): Promise<void> {
    this.categoryService.getCategoriesSequencer().subscribe(categories => {
      this.categories = categories;

      this.soundService.getSequencerSounds().subscribe(async sounds => {
        this.sounds = await Promise.all(sounds.map(async sound => {
          const soundUrl = environment.apiUrl + '/uploads/' + sound.soundPath;
          const buffer = await this.loadAudioBuffer(soundUrl);
          return { ...sound, buffer };
        }));

        this.rows = this.categories.map(category => {
          const soundsForCategory = this.sounds.filter(sound => sound.category.id === category.id);

          return {
            category,
            sounds: soundsForCategory,
            selectedSound: soundsForCategory.length > 0 ? soundsForCategory[0] : null,
            steps: Array.from({ length: 12 }, () => ({ active: false }))
          };
        });
      });
    });
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

  saveInstrumental(): void {
    this.authService.getUserId().subscribe({
      next: (data) => {
        const userId = data.userId;

        const steps = this.rows
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
          .filter(step => step !== null);

        const dto = {
          instName: this.instName,
          bpm: this.bpm.toString(),
          isPublic: this.isPublic,
          userId: userId,
          steps: steps
        };

        const formData = new FormData();
        formData.append('data', new Blob([JSON.stringify(dto)], { type: 'application/json' }));

        if (this.coverFile) {
          formData.append('coverUrl', this.coverFile);
        }

        this.instrumentalService.createInstrumental(formData).subscribe({
          next: res => {
            console.log('Instrumental creado correctamente', res);
            this.router.navigate(['/my-instrumentals']);
          },
          error: err => {
            console.error('Error al guardar el instrumental:', err);
          }
        });
      },
      error: err => {
        console.error('Error al obtener el userId:', err);
      }
    });
  }
}