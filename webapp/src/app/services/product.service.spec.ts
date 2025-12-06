import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { ProductService } from './product.service';
import { environment } from '../../environments/environment';
import { Product } from '../types/product';

describe('ProductService', () => {
  let service: ProductService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductService]
    });

    service = TestBed.inject(ProductService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify(); // verificar que no queden requests pendientes
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get all products', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Laptop', price: 1200 },
      { id: '2', name: 'Mouse', price: 50 }
    ] as any;

    service.getAllProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/product`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should get product by id', () => {
    const mockProduct: Product = {
      id: '1',
      name: 'Keyboard',
      price: 100
    } as any;

    service.getProductbyId('1').subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/product/1`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should add a product', () => {
    const newProduct: Product = {
      id: '3',
      name: 'Headphones',
      price: 80
    } as any;

    const mockResponse = { success: true };

    service.addProduct(newProduct).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/product`);
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual(newProduct);

    req.flush(mockResponse);
  });

  it('should update a product', () => {
    const updatedProduct: Product = {
      id: '1',
      name: 'Mechanical Keyboard',
      price: 150
    } as any;

    const mockResponse = { success: true };

    service.updateProduct('1', updatedProduct).subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/product/1`);
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual(updatedProduct);

    req.flush(mockResponse);
  });

  it('should delete a product', () => {
    const mockResponse = { success: true };

    service.deleteProduct('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/product/1`);
    expect(req.request.method).toBe('DELETE');

    req.flush(mockResponse);
  });

});
