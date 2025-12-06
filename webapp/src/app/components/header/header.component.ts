import { Component, Inject, inject } from '@angular/core';
import { CategoryServices } from '../../services/category.service';
import { Category } from '../../types/category';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { CustomerService } from '../../services/customer.service';
import { FormsModule } from '@angular/forms';
import { CommonModule,} from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule,MatIconModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {

  customerServices = inject(CustomerService);
  authService = inject(AuthService);    // 👈 CORRECTO
  router = inject(Router);

  categoryList: Category[] = [];
  searchTerm: string = '';
  cartCount: number = 0;

  ngOnInit() {

    // ✔️ cargar categorías (no mezclado con el carrito)
    this.customerServices.getCategories().subscribe(result => {
      this.categoryList = result;
    });

   
  }

  onSearch(e: any) {
    if (e.target.value) {
      this.router.navigateByUrl("/product?search=" + e.target.value);
    }
  }

  searchCategory(id: string) {
    this.searchTerm = "";
    this.router.navigateByUrl("/product?categoryId=" + id);
  }

  logout() {
    this.authService.logout();
    this.router.navigateByUrl("/login");
  }

  goToCart() {
    this.router.navigate(['/cart']);
  }
}

