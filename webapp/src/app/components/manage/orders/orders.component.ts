import { Component, inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../types/order';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import {MatButtonToggleModule} from '@angular/material/button-toggle';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [DatePipe,MatButtonToggleModule],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {
orderService=inject(OrderService);
orders:Order[]=[];

ngOnInit(){
  this.orderService.getAdminOrder().subscribe(result=>{
    this.orders=result;
  });
}

statusChanged(button:any,order:Order){
console.log(button.value);
this.orderService.updateOrderStatus(order._id!,button.value).subscribe(result=>{
  alert("Estado del pedido actualizado");
})
}

}
