import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from '../../core/services/category.service';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-category',
  imports: [CommonModule],
  templateUrl: './category.component.html',
  styleUrl: './category.component.scss'
})
export class CategoryComponent implements OnInit {
  categories: any[] = [];
  error : String | null = null;
  public environment = environment;
  
  constructor(private categoryService: CategoryService, private router: Router) {}
  
  ngOnInit() {
    this.categoryService.fetchCategories().subscribe({
      next: (res: any) => (this.categories = res),
      error: (err: HttpErrorResponse) => {
        if(err.status === 403){
          this.router.navigate(['/forbidden']);
        } else {
          this.error = 'An error ocurred'
        }
      },
    })
  }

  crearCategoria() {
    this.router.navigate(['/category-form', { mode: 'create' }]);
  }
  
  editarCategoria(id: number) {
    if(id) {
      this.router.navigate(['/category-form', { mode: 'edit', categoryId: id }]);
    } else {
      console.error('El ID es inválido');
    }
  }

  eliminarCategoria(id: number): void {
     this.categoryService.deleteCategory(id).subscribe(() => {
      this.categories = this.categories.filter(category => category.id !== id);
    });
  }
}
