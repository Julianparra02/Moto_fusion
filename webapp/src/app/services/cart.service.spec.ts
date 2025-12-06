import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CartService } from './cart.service';
import { environment } from '../../environments/environment';
import { CartItem } from '../types/cartItem';

describe('CartService', () => {
  let service: CartService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CartService]
    });

    service = TestBed.inject(CartService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // verifica que no queden peticiones pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get cart items', () => {
    const mockItems: CartItem[] = [
    ];

    service.getCartItems().subscribe(items => {
      expect(items).toEqual(mockItems);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/carts`);
    expect(req.request.method).toBe('GET');
    req.flush(mockItems);
  });

  it('should add item to cart', () => {
    const mockResponse = { success: true };

    service.addToCart('1', 3).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/carts/1`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ quantity: 3 });

    req.flush(mockResponse);
  });

  it('should remove item from cart', () => {
    const mockResponse = { success: true };

    service.removeFromCart('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/carts/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

  it('should initialize and load items into service.items', () => {
    const mockItems: CartItem[] = [
   
    ];

    service.init();

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/carts`);
    expect(req.request.method).toBe('GET');

    req.flush(mockItems);

    expect(service.items).toEqual(mockItems);
  });

});
