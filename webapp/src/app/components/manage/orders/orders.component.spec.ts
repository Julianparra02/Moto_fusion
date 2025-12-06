import { ComponentFixture, TestBed } from '@angular/core/testing';
import { OrdersComponent } from './orders.component';
import { RouterTestingModule } from '@angular/router/testing';
import { OrderService } from '../../../services/order.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

// ===== MOCK ORDER SERVICE =====
class MockOrderService {
  getAdminOrder() {
    return of([
      { 
        _id: '1',
        total: 200,
        status: 'pending',
        date: new Date(),
        address: {
          address1: 'Calle 1',
          address2: 'Apto 2',
          city: 'Bogotá',
          pincode: '110111'
        },
        items: [
          {
            product: {
              _id: 'P1',
              name: 'Producto 1',
              price: 100,
              images: ['img1.png']
            },
            quantity: 2
          }
        ]
      },
      { 
        _id: '2',
        total: 100,
        status: 'shipped',
        date: new Date(),
        address: {
          address1: 'Av 10',
          address2: '',
          city: 'Medellín',
          pincode: '050001'
        },
        items: [
          {
            product: {
              _id: 'P2',
              name: 'Producto 2',
              price: 50,
              images: ['img2.png']
            },
            quantity: 1
          }
        ]
      }
    ]);
  }

  updateOrderStatus(id: string, status: string) {
    return of({ success: true });
  }
}

describe('OrdersComponent', () => {
  let component: OrdersComponent;
  let fixture: ComponentFixture<OrdersComponent>;
  let orderService: OrderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        OrdersComponent,          // standalone
        RouterTestingModule,
        NoopAnimationsModule      // Necesario para Angular Material
      ],
      providers: [
        { provide: OrderService, useClass: MockOrderService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(OrdersComponent);
    component = fixture.componentInstance;
    orderService = TestBed.inject(OrderService);

    fixture.detectChanges(); // Ejecuta ngOnInit()
  });

  // ==== BASIC CREATION ====
  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // ==== LOAD ORDERS ====
  it('should load orders on init', () => {
    expect(component.orders.length).toBe(2);
    expect(component.orders[0].address.address1).toBe('Calle 1');
    expect(component.orders[0].items.length).toBe(1);
  });

  // ==== STATUS CHANGE ====
  it('should call updateOrderStatus when statusChanged() is triggered', () => {
    const spyUpdate = spyOn(orderService, 'updateOrderStatus').and.callThrough();

    const dummyEvent = { value: 'Enviado' };
    const order = component.orders[0];

    component.statusChanged(dummyEvent, order);

   expect(spyUpdate).toHaveBeenCalledWith(order._id!, 'Enviado');

  });
});
