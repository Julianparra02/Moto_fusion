import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { OrderService } from './order.service';
import { environment } from '../../environments/environment';
import { Order } from '../types/order';

describe('OrderService', () => {
  let service: OrderService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [OrderService]
    });

    service = TestBed.inject(OrderService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // asegúrate de no dejar requests pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should add an order', () => {
    const mockOrder: Order = {
      id: '1',
      items: [],
      total: 300
    } as any;

    const mockResponse = { success: true };

    service.addOrder(mockOrder).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/order`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(mockOrder);
    req.flush(mockResponse);
  });

  it('should get customer orders', () => {
    const mockOrders: Order[] = [
      { id: '1', items: [], total: 100 },
      { id: '2', items: [], total: 200 }
    ] as any;

    service.getCustomerOrders().subscribe(orders => {
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/orders`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should get admin orders', () => {
    const mockOrders: Order[] = [
      { id: '10', items: [], total: 999 }
    ] as any;

    service.getAdminOrder().subscribe(orders => {
      expect(orders).toEqual(mockOrders);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/orders`);
    expect(req.request.method).toBe('GET');
    req.flush(mockOrders);
  });

  it('should update order status', () => {
    const mockResponse = { success: true };
    const id = '10';
    const status = 'delivered';

    service.updateOrderStatus(id, status).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/orders/${id}`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ status });

    req.flush(mockResponse);
  });

});

