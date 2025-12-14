import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { CategoryServices } from '../../../services/category.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-category-form',
  standalone: true,
  imports: [
    FormsModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatSnackBarModule
  ],
  templateUrl: './category-form.component.html',
  styleUrl: './category-form.component.scss'
})
export class CategoryFormComponent {

  name!: string;
  id!: string;
  isEdit = false;

  private categoryServices = inject(CategoryServices);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.isEdit = true;
      this.categoryServices.getCategoryById(this.id).subscribe({
        next: (result: any) => {
          this.name = result.name;
        },
        error: () => {
          this.snackBar.open(
            'Error al cargar la categoría',
            'Cerrar',
            { duration: 3000 }
          );
        }
      });
    }
  }

  add(): void {
    if (!this.name) return;

    this.categoryServices.addCategory(this.name).subscribe({
      next: () => {
        this.snackBar.open(
          'Categoría agregada correctamente',
          'Aceptar',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );

        this.router.navigateByUrl('/admin/category');
      },
      error: () => {
        this.snackBar.open(
          'Error al agregar la categoría',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  update(): void {
    if (!this.id || !this.name) return;

    this.categoryServices.updateCategory(this.id, this.name).subscribe({
      next: () => {
        this.snackBar.open(
          'Categoría actualizada correctamente',
          'Aceptar',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );

        this.router.navigateByUrl('/admin/category');
      },
      error: () => {
        this.snackBar.open(
          'Error al actualizar la categoría',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }
}
