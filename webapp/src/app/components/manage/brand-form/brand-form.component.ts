import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { BrandService } from '../../../services/brand.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-brand-form',
  standalone: true,
  imports: [
    MatInputModule,
    MatButtonModule,
    FormsModule,
    MatSnackBarModule
  ],
  templateUrl: './brand-form.component.html',
  styleUrl: './brand-form.component.scss',
})
export class BrandFormComponent {

  name!: string;
  id!: string;

  private brandsService = inject(BrandService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];

    if (this.id) {
      this.brandsService.getBrandById(this.id).subscribe({
        next: (result) => {
          this.name = result.name;
        },
        error: () => {
          this.snackBar.open(
            'Error al cargar la marca',
            'Cerrar',
            { duration: 3000 }
          );
        }
      });
    }
  }

  add(): void {
    if (!this.name) return;

    this.brandsService.addBrand(this.name).subscribe({
      next: () => {
        this.snackBar.open(
          'Marca agregada correctamente',
          'Aceptar',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );

        this.router.navigateByUrl('/admin/brands');
      },
      error: () => {
        this.snackBar.open(
          'Error al agregar la marca',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  update(): void {
    if (!this.id || !this.name) return;

    this.brandsService.updateBrand(this.id, this.name).subscribe({
      next: () => {
        this.snackBar.open(
          'Marca actualizada correctamente',
          'Aceptar',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );

        this.router.navigateByUrl('/admin/brands');
      },
      error: () => {
        this.snackBar.open(
          'Error al actualizar la marca',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }
}
