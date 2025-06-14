import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CategoryService } from '../../core/services/category.service'; 
import { Category } from '../../models/category';

@Component({
  selector: 'app-category-form',
  imports: [CommonModule, FormsModule],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent implements OnInit {
  categoria: Category = {
    name: '',
    color: '',
    iconUrl: ''
  };
  selectedFile: File | null = null;
  mode: string = 'create';
  categoryId: string | null = null;
  
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
    }
  }

  constructor(
    private route: ActivatedRoute,
    private categoryService: CategoryService,
    private router: Router
  ) {}

  ngOnInit() {
    this.mode = this.route.snapshot.paramMap.get('mode') || 'create';
    this.categoryId = this.route.snapshot.paramMap.get('categoryId');

    if (this.mode === 'edit' && this.categoryId) {
      this.cargarCategoria();
    }
  }

  cargarCategoria() {
    if (this.categoryId) {
      this.categoryService.getCategoryById(Number(this.categoryId)).subscribe((data: Category) => {
      this.categoria = {
        name: data.name,
        color: data.color,
        iconUrl: data.iconUrl 
        };
      });
    }
  }

  guardarCategoria() {
  const formData = new FormData();
  formData.append('name', this.categoria.name);
  formData.append('color', this.categoria.color);
  
  if (this.selectedFile) {
    formData.append('iconUrl', this.selectedFile);
  }

  if (this.mode === 'create') {
    this.categoryService.createCategory(formData).subscribe(() => {
      this.router.navigate(['/categories']);
    });
  } else if (this.mode === 'edit' && this.categoryId) {
    formData.append('id', this.categoryId); // por si tu backend necesita el ID como campo
    this.categoryService.updateCategory(Number(this.categoryId), formData).subscribe(() => {
      this.router.navigate(['/categories']);
    });
  }
}
}
