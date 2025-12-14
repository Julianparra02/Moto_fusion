import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { Order } from '../../types/order';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';



@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule,MatButtonModule,MatRadioModule,FormsModule,MatSnackBarModule ],
  templateUrl: './shopping-cart.component.html',
  styleUrl: './shopping-cart.component.scss'
})
export class ShoppingCartComponent {
  cartService=inject(CartService);
  ngOninit(){ 
    this.cartService.init();
  }
get cartItems(){
  return this.cartService.items;
}

addToCart(productId: string,quantity: number){
  this.cartService.addToCart(productId,quantity).subscribe(result=>{
  this.cartService.init();
  })
}

get totalAmmount(){
  let ammount=0;
  for (let index = 0; index < this.cartItems.length; index++) {
    const element = this.cartItems[index];
    ammount+= element.product.price * element.quantity;
  }
  return   ammount;
}

orderStep:number=0;
formbuilder=inject(FormBuilder);
paymentType='cash';
addressForm=this.formbuilder.group({
  address1:[''],
  address2:[''],
  city:[''],
  pincode:[''],
});

checkout(){
  this.orderStep=1;
}

addAddress(){
  this.orderStep=2;
}
orderService=inject(OrderService);
router=inject(Router);
snackBar = inject(MatSnackBar);
completeOrder() {
  const order: Order = {
    items: this.cartItems,
    paymentType: this.paymentType,
    address: this.addressForm.value,
    date: new Date(),
  };

  this.orderService.addOrder(order).subscribe({
    next: () => {
      // 🎉 MENSAJE BONITO
      const snack = this.snackBar.open(
        '✅ Tu pedido fue realizado con éxito',
        'Ver pedidos',
        {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['success-snackbar']
        }
      );

      // 👉 Acción del botón
      snack.onAction().subscribe(() => {
        this.router.navigateByUrl('/orders');
      });

      // 🧹 limpiar carrito y estado
      this.cartService.init();
      this.orderStep = 0;
    },
    error: () => {
      this.snackBar.open(
        '❌ Error al procesar el pedido',
        'Cerrar',
        {
          duration: 4000,
          horizontalPosition: 'right',
          verticalPosition: 'top',
          panelClass: ['error-snackbar']
        }
      );
    }
  });
}

}