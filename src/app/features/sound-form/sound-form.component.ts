import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { SoundService } from '../../core/services/sound.service';
import { CategoryService } from '../../core/services/category.service';

@Component({
  selector: 'app-sound-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sound-form.component.html',
  styleUrl: './sound-form.component.scss'
})
export class SoundFormComponent implements OnInit {
  sound: any = {
    name: '',
    duration: '',
    enabled: true,
    categoryId: null
  };

  selectedAudioFile: File | null = null;
  selectedImageFile: File | null = null;

  categories: any[] = [];
  mode: string = 'create';
  soundId: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private soundService: SoundService,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.mode = this.route.snapshot.paramMap.get('mode') || 'create';
    this.soundId = this.route.snapshot.paramMap.get('soundId');
    this.cargarCategorias();

    if (this.mode === 'edit' && this.soundId) {
      this.cargarSonido();
    }
  }

  cargarCategorias(): void {
    this.categoryService.fetchCategories().subscribe({
      next: (res: any) => (this.categories = res),
      error: () => console.error('Error al cargar categorías')
    });
  }

  cargarSonido(): void {
    if (this.soundId) {
      this.soundService.getSoundById(Number(this.soundId)).subscribe({
        next: (data: any) => {
          this.sound = {
            name: data.name,
            duration: data.duration,
            enabled: data.enabled,
            categoryId: data.category?.id || null
          };
        },
        error: () => console.error('Error al cargar sonido')
      });
    }
  }

  onAudioSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedAudioFile = file;
      this.getAudioDuration(file).then((duration) => {
        this.sound.duration = duration;
      });
    }
  }

  onImageSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedImageFile = file;
    }
  }

  getAudioDuration(file: File): Promise<string> {
    return new Promise((resolve) => {
      const audio = document.createElement('audio');
      audio.preload = 'metadata';

      audio.onloadedmetadata = () => {
        const duration = audio.duration;
        const minutes = Math.floor(duration / 60);
        const seconds = Math.floor(duration % 60).toString().padStart(2, '0');
        resolve(`${minutes}:${seconds}`);
      };

      audio.src = URL.createObjectURL(file);
    });
  }

  guardarSonido(): void {
    const formData = new FormData();
    formData.append('name', this.sound.name);
    formData.append('duration', this.sound.duration.toString());
    formData.append('enabled', String(this.sound.enabled));
    formData.append('categoryId', this.sound.categoryId ? this.sound.categoryId.toString() : '');

    if (this.selectedAudioFile) {
      formData.append('soundPath', this.selectedAudioFile);
    }

    if (this.selectedImageFile) {
      formData.append('image', this.selectedImageFile);
    }

    if (this.mode === 'create') {
      this.soundService.createSound(formData).subscribe(() => {
        this.router.navigate(['/sounds']);
      });
    } else if (this.mode === 'edit' && this.soundId) {
      this.soundService.updateSound(Number(this.soundId), formData).subscribe(() => {
        this.router.navigate(['/sounds']);
      });
    }
  }
}