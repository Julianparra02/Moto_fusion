import { Component, inject, ViewChild } from '@angular/core';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { CategoryServices } from '../../../services/category.service';
import { Category } from '../../../types/category';

@Component({
  selector: 'app-categories',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    RouterLink,
    MatSnackBarModule
  ],
  templateUrl: './categories.component.html',
  styleUrl: './categories.component.scss'
})
export class CategoriesComponent {

  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<Category> = new MatTableDataSource<Category>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private categoryServices = inject(CategoryServices);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getServerData();
  }

 private getServerData(): void {
  this.categoryServices.getCategories().subscribe({
    next: (result: any) => {
      this.dataSource.data = result.categories; // 👈 AQUÍ ESTÁ LA CLAVE
    },
    error: () => {
      this.snackBar.open(
        'Error al cargar las categorías',
        'Cerrar',
        { duration: 3000 }
      );
    }
  });
}


  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
    this.dataSource.sort = this.sort;
  }

  applyFilter(event: Event): void {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  delete(id: string): void {
    this.categoryServices.deleteCategoryById(id).subscribe({
      next: () => {
        this.snackBar.open(
          'Categoría eliminada correctamente',
          'Aceptar',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );
        this.getServerData();
      },
      error: () => {
        this.snackBar.open(
          'Error al eliminar la categoría',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }
}
