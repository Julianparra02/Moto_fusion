import { Component, inject, Input } from '@angular/core';
import { Product } from '../../types/product';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { RouterLink } from '@angular/router';
import { CartService } from '../../services/cart.service';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule, MatIconModule,MatButtonModule,RouterLink],
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss']
})
export class ProductCardComponent {
  @Input() product!: Product;


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


