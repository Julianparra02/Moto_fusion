import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Product } from '../types/product';
import { environment } from '../../environments/environment';
import { Category } from '../types/category';
import { Brand } from '../types/brand';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  private http = inject(HttpClient);

  getNewProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}/customer/new-products`);
  }

  getFeaturedProducts() {
    return this.http.get<Product[]>(`${environment.apiUrl}/customer/featured-products`);
  }

  getCategories() {
    return this.http.get<Category[]>(`${environment.apiUrl}/customer/categories`);
  }

  getBrands() {
    return this.http.get<Brand[]>(`${environment.apiUrl}/customer/brands`);
  }

  getProductById(id: string) {
  return this.http.get<Product>(`${environment.apiUrl}/customer/products/${id}`);
  // 🔁 si tu endpoint real es otro (ej. /products/:id), cámbialo aquí
}

  getProducts(searchQuery: {
    searchTerm?: string,
    categoryId?: string,
    sortBy?: string,
    sortOrder?: number,
    brandId?: string,
    page: number,
    pageSize: number,
    marca?: string,
    modelo?: string,
    year?: number
  }) {
    // Usar HttpParams para construir los parámetros de manera más limpia y segura
    let params = new HttpParams()
      .set('page', searchQuery.page.toString())
      .set('pageSize', searchQuery.pageSize.toString());

    // Agregar parámetros solo si tienen valor
    if (searchQuery.searchTerm) params = params.set('searchTerm', searchQuery.searchTerm);
    if (searchQuery.categoryId) params = params.set('categoryId', searchQuery.categoryId);
    if (searchQuery.sortBy) params = params.set('sortBy', searchQuery.sortBy);
    if (searchQuery.sortOrder) params = params.set('sortOrder', searchQuery.sortOrder.toString());
    if (searchQuery.brandId) params = params.set('brandId', searchQuery.brandId);
    if (searchQuery.marca) params = params.set('marca', searchQuery.marca);
    if (searchQuery.modelo) params = params.set('modelo', searchQuery.modelo);
    if (searchQuery.year !== undefined && searchQuery.year !== null) {
  params = params.set('year', searchQuery.year.toString());
}

    return this.http.get<Product[]>(`${environment.apiUrl}/customer/products`, { params });
  }
}