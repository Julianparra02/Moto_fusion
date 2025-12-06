import { Component, inject } from '@angular/core';
import { CartService } from '../../services/cart.service';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import {MatRadioModule} from '@angular/material/radio';
import { Order } from '../../types/order';
import { OrderService } from '../../services/order.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [ReactiveFormsModule,MatInputModule,MatButtonModule,MatRadioModule,FormsModule],
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
completeOrder(){
  let order : Order ={
    items:this.cartItems,
    paymentType:this.paymentType,
    address:this.addressForm.value,
    date:new Date(),
  };
this.orderService.addOrder(order).subscribe((result)=>{
  alert("Tu pedido está cumplido");
this.cartService.init();
this.orderStep=0;
this.router.navigateByUrl('/orders');
});
}
}