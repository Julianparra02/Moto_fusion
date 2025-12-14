import { Component, inject } from '@angular/core';
import { OrderService } from '../../../services/order.service';
import { Order } from '../../../types/order';
import { DatePipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonToggleModule,
    MatSnackBarModule
  ],
  templateUrl: './orders.component.html',
  styleUrl: './orders.component.scss'
})
export class OrdersComponent {

  private orderService = inject(OrderService);
  private snackBar = inject(MatSnackBar);

  orders: Order[] = [];

  ngOnInit(): void {
    this.orderService.getAdminOrder().subscribe({
      next: (result) => {
        this.orders = result;
      },
      error: () => {
        this.snackBar.open(
          'Error al cargar las órdenes',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }

  statusChanged(event: any, order: Order): void {
    const newStatus = event.value;

    this.orderService.updateOrderStatus(order._id!, newStatus).subscribe({
      next: () => {
        this.snackBar.open(
          'Estado del pedido actualizado',
          'Aceptar',
          {
            duration: 3000,
            horizontalPosition: 'center',
            verticalPosition: 'top'
          }
        );
      },
      error: () => {
        this.snackBar.open(
          'Error al actualizar el estado',
          'Cerrar',
          { duration: 3000 }
        );
      }
    });
  }
}
