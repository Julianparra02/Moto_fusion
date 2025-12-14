import { Component, inject, ViewChild } from '@angular/core';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { Brand } from '../../../types/brand';
import { BrandService } from '../../../services/brand.service';

@Component({
  selector: 'app-brands',
  standalone: true,
  imports: [
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatSortModule,
    MatPaginatorModule,
    MatButtonModule,
    MatSnackBarModule,
    RouterLink
  ],
  templateUrl: './brands.component.html',
  styleUrl: './brands.component.scss'
})
export class BrandsComponent {

  displayedColumns: string[] = ['id', 'name', 'action'];
  dataSource: MatTableDataSource<Brand> = new MatTableDataSource<Brand>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private brandServices = inject(BrandService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getServerData();
  }

  private getServerData(): void {
    this.brandServices.getBrands().subscribe({
      next: (result) => {
        this.dataSource.data = result;
      },
      error: () => {
        this.snackBar.open(
          'Error al cargar las marcas',
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
    this.brandServices.deleteBrandById(id).subscribe({
      next: () => {
        this.snackBar.open(
          'Marca eliminada correctamente',
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
          'Error al eliminar la marca',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }
}
