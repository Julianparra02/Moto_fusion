import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, RouterModule, MatButtonModule, MatIconModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.scss'
})
export class ProductDetailComponent implements OnInit {

  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);

  product?: Product;
  loading = true;
  error = '';

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.error = 'Producto no encontrado';
      this.loading = false;
      return;
    }

    this.customerService.getProductById(id).subscribe({
      next: (p) => {
        this.product = p;
        this.loading = false;
      },
      error: (err) => {
        console.error(err);
        this.error = 'No se pudo cargar el producto.';
        this.loading = false;
      }
    });
  }
  cartService=inject(CartService);
  addToCart(product: Product){
  console.log(product);
  if(!this.isProductInCart(product._id!)){
    this.cartService.addToCart(product._id!,1).subscribe(()=>{
      this.cartService.init();
    });
  }else{
    this.cartService.removeFromCart(product._id!).subscribe(()=>{
      this.cartService.init();
    });
  }
  } 
  isProductInCart(productId:string) {
      if (this.cartService.items.find(x => x.product._id === productId)) {
        return true;
      }else{
        return false;
      }
  
    }
}
