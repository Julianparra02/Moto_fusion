import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Category } from '../types/category';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class CategoryServices {

  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/category`;

  constructor() {}

  private getHeaders() {
    const token = localStorage.getItem('token');
    return {
      headers: new HttpHeaders({
        Authorization: `Bearer ${token}`
      })
    };
  }

  getCategories() {
    return this.http.get<Category[]>(this.apiUrl, this.getHeaders());
  }

  getCategoryById(id: string) {
    return this.http.get<Category>(`${this.apiUrl}/${id}`, this.getHeaders());
  }

  addCategory(name: string) {
    return this.http.post(
      this.apiUrl,
      { name },
      this.getHeaders()
    );
  }

  updateCategory(id: string, name: string) {
    return this.http.put(
      `${this.apiUrl}/${id}`,
      { name },
      this.getHeaders()
    );
  }

  deleteCategoryById(id: string) {
    return this.http.delete(
      `${this.apiUrl}/${id}`,
      this.getHeaders()
    );
  }
}
