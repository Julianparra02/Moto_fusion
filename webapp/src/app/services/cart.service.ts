import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { CartItem } from '../types/cartItem';
import { Order } from '../types/order';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  http = inject(HttpClient);
  items: CartItem[] = [];

  constructor() {}

  private getAuthHeaders() {
    const token = localStorage.getItem("token");

    return {
      headers: new HttpHeaders({
        "Authorization": `Bearer ${token}`
      })
    };
  }

  init() {
    this.getCartItems().subscribe(result => {
      this.items = result;
    });
  }

  getCartItems() {
    return this.http.get<CartItem[]>(
      environment.apiUrl + '/customer/carts',
      this.getAuthHeaders()
    );
  }

  addToCart(productId: string, quantity: number) {
    return this.http.post(
      environment.apiUrl + '/customer/carts/' + productId,
      { quantity },
      this.getAuthHeaders()
    );
  }

  removeFromCart(productId: string) {
    return this.http.delete(
      environment.apiUrl + '/customer/carts/' + productId,
      this.getAuthHeaders()
    );
  }
}
