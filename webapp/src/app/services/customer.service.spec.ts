import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CustomerService } from './customer.service';
import { environment } from '../../environments/environment';
import { Product } from '../types/product';
import { Category } from '../types/category';
import { Brand } from '../types/brand';

describe('CustomerService', () => {
  let service: CustomerService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CustomerService]
    });

    service = TestBed.inject(CustomerService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get new products', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Laptop', price: 1200 }
    ] as any;

    service.getNewProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/new-products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should get featured products', () => {
    const mockProducts: Product[] = [
      { _id: '10', name: 'Smartphone', price: 900 }
    ] as any;

    service.getFeaturedProducts().subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/featured-products`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

  it('should get customer categories', () => {
    const mockCategories: Category[] = [
      { _id: '1', name: '' }
    ];

    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/categories`);
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should get customer brands', () => {
    const mockBrands: Brand[] = [
    ];

    service.getBrands().subscribe(brands => {
      expect(brands).toEqual(mockBrands);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/brands`);
    expect(req.request.method).toBe('GET');
    req.flush(mockBrands);
  });

  it('should get product by id', () => {
    const mockProduct: Product = { id: '5', name: 'Tablet', price: 300 } as any;

    service.getProductById('5').subscribe(product => {
      expect(product).toEqual(mockProduct);
    });

    const req = httpMock.expectOne(`${environment.apiUrl}/customer/products/5`);
    expect(req.request.method).toBe('GET');
    req.flush(mockProduct);
  });

  it('should get products with search parameters', () => {
    const mockProducts: Product[] = [
      { id: '1', name: 'Xbox', price: 499 }
    ] as any;

    const filters = {
      page: 1,
      pageSize: 10,
      searchTerm: 'xbox',
      brandId: '3',
      sortBy: 'price',
      sortOrder: 1,
      year: 2022,
    };

    service.getProducts(filters).subscribe(products => {
      expect(products).toEqual(mockProducts);
    });

    const req = httpMock.expectOne(request => 
      request.url === `${environment.apiUrl}/customer/products` &&
      request.params.get('page') === '1' &&
      request.params.get('pageSize') === '10' &&
      request.params.get('searchTerm') === 'xbox' &&
      request.params.get('brandId') === '3' &&
      request.params.get('sortBy') === 'price' &&
      request.params.get('sortOrder') === '1' &&
      request.params.get('year') === '2022'
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockProducts);
  });

});
