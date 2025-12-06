import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CustomerOrdersComponent } from './customer-orders.component';
import { of } from 'rxjs';
import { OrderService } from '../../services/order.service';
import { DatePipe } from '@angular/common';

// 🔹 MOCK SERVICE
class MockOrderService {
  getCustomerOrders() {
    return of([
      {
        _id: '1',
        date: new Date('2024-01-01'),
        items: [],
        paymentType: 'card',
        totalAmount: 100,
        status: 'delivered'
      }
    ]);
  }
}

describe('CustomerOrdersComponent', () => {
  let component: CustomerOrdersComponent;
  let fixture: ComponentFixture<CustomerOrdersComponent>;
  let orderService: MockOrderService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CustomerOrdersComponent], // Standalone
      providers: [
        DatePipe,
        { provide: OrderService, useClass: MockOrderService } // mock
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CustomerOrdersComponent);
    component = fixture.componentInstance;

    // obtenemos instancia del servicio mock
    orderService = TestBed.inject(OrderService) as any;

    fixture.detectChanges(); // ejecuta ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load orders from service on init', () => {
    expect(component.orders.length).toBe(1);

  });

  it('should call getCustomerOrders()', () => {
    const spy = spyOn(orderService, 'getCustomerOrders').and.callThrough();

    component.ngOnInit();

    expect(spy).toHaveBeenCalledTimes(1);
  });
});
