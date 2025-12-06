import { Component, inject, OnInit } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { ProductCardComponent } from '../product-card/product-card.component';
import { ActivatedRoute } from '@angular/router';
import { MatSelectModule } from '@angular/material/select';
import { Category } from '../../types/category';
import { Brand } from '../../types/brand';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductCardComponent, MatSelectModule, FormsModule],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.scss'
})
export class ProductListComponent implements OnInit {

  customerService = inject(CustomerService);

  searchTerm: string = '';
  categoryId: string = '';
  sortBy: string = '';
  sortOrder: number = -1;
  brandId: string = '';
  page = 1;
  pageSize = 6;

  // 🔹 filtros de compatibilidad
  marca: string = '';                      // marca del PRODUCTO (raíz)
  marcas: string[] = ["YAMAHA","SUZUKI","KAWASAKI","HONDA"];                   // se llenará con getBrands()
  modelo: string = '';                     // modelo de la MOTO (compatibilidad.modelo)
  modelos: string[] = ["YZFR15", "150CC", "250CC", "MT-15", "Gixxer 150CC", "CDF-160", "Ninja 150", "GSX R150"];
  year: number | undefined = undefined;    // year de la MOTO (compatibilidad.year)
  years: number[] = [2018, 2019, 2020, 2021, 2022, 2023, 2024];

  products: Product[] = [];
  route = inject(ActivatedRoute);
  category: Category[] = [];
  brands: Brand[] = [];

  ngOnInit() {

    this.customerService.getCategories().subscribe(result => {
      this.category = result;
    });

    this.customerService.getBrands().subscribe(result => {
      this.brands = result;
    });

    this.route.queryParams.subscribe((x: any) => {
      this.searchTerm = x.search || '';
      this.categoryId = x.categoryId || '';
      this.getProducts();
    });
  }

  getProducts() {
    this.customerService.getProducts({
      searchTerm: this.searchTerm,
      categoryId: this.categoryId,
      sortBy: this.sortBy,
      sortOrder: this.sortOrder,
      brandId: this.brandId,
      page: this.page,
      pageSize: this.pageSize,
      marca: this.marca || undefined,     // marca del producto
      modelo: this.modelo || undefined,   // modelo en compatibilidad
      year: this.year                     // year en compatibilidad (undefined si no hay)
    }).subscribe(result => {
      this.products = result;
    });
  }

  // 🔹 HANDLERS PARA LOS SELECTS

  onMarcaChange(marca: string) {
    this.marca = marca;
    this.page = 1;
    this.getProducts();
  }

  onModeloChange(modelo: string) {
    this.modelo = modelo;
    this.page = 1;
    this.getProducts();
  }

  onYearChange(year: string) {
    this.year = year ? Number(year) : undefined;
    this.page = 1;
    this.getProducts();
  }

  onBrandChange(brandId: string) {
    this.brandId = brandId;
    this.page = 1;
    this.getProducts();
  }

  onCategoryChange(categoryId: string) {
    this.categoryId = categoryId;
    this.page = 1;
    this.getProducts();
  }
  resetFilters() {
  this.marca = '';
  this.modelo = '';
  this.year = undefined;
  this.brandId = '';
  this.categoryId = '';
  this.searchTerm = '';
  this.page = 1;

  this.getProducts();
}
}

