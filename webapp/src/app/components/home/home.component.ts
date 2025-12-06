import { Component, Inject, inject } from '@angular/core';
import { CustomerService } from '../../services/customer.service';
import { Product } from '../../types/product';
import { CommonModule } from '@angular/common'; 
import { MatIconModule } from '@angular/material/icon';
import { ProductCardComponent } from '../product-card/product-card.component';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';
import { CartService } from '../../services/cart.service';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, MatIconModule, CarouselModule,ProductCardComponent,], 
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {
  customOptions: OwlOptions = {
    loop: true,
    mouseDrag: false,
    touchDrag: false,
    pullDrag: false,
    dots: true,
    navSpeed: 700,
    navText: ['', ''], 
    nav: true
  }

  customerService = inject(CustomerService);
  newProducts: Product[] = [];
  featuredProducts: Product[] = [];
  bannerImages:Product[]=[];
  cartService=inject(CartService);
  
  trackByIndex(index: number) {
  return index;
}
  ngOnInit() {
    this.customerService.getFeaturedProducts().subscribe(result => {
      this.featuredProducts = result;
      console.log('Featured Products:', this.featuredProducts);
    });
    
    this.customerService.getNewProducts().subscribe(result => {
      this.newProducts = result;
      console.log('New Products:', this.newProducts);
    });
  }
}