import { Component, inject, ViewChild } from '@angular/core';

import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { ProductService } from '../../../services/product.service';
import { Brand } from '../../../types/brand';

@Component({
  selector: 'app-products',
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
  templateUrl: './products.component.html',
  styleUrl: './products.component.scss'
})
export class ProductsComponent {

  displayedColumns: string[] = ['id', 'name', 'description', 'reference', 'price', 'action'];
  dataSource: MatTableDataSource<Brand> = new MatTableDataSource<Brand>([]);

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  private productService = inject(ProductService);
  private snackBar = inject(MatSnackBar);

  ngOnInit(): void {
    this.getServerData();
  }

  private getServerData(): void {
    this.productService.getAllProducts().subscribe({
      next: (result) => {
        this.dataSource.data = result as unknown as Brand[];
      },
      error: () => {
        this.snackBar.open(
          'Error al cargar los productos',
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
    this.productService.deleteProduct(id).subscribe({
      next: () => {
        this.snackBar.open(
          'Producto eliminado correctamente',
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
          'Error al eliminar el producto',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }
}
