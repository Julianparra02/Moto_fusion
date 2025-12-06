import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { CategoryServices } from './category.service';
import { Category } from '../types/category';

describe('CategoryServices', () => {
  let service: CategoryServices;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [CategoryServices]
    });

    service = TestBed.inject(CategoryServices);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should get categories', () => {
    const mockCategories: Category[] = [
      { _id: '1', name: '' },
      { _id: '2', name: '' }
    ];

    service.getCategories().subscribe(categories => {
      expect(categories).toEqual(mockCategories);
    });

    const req = httpMock.expectOne('http://localhost:3000/category');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategories);
  });

  it('should get category by id', () => {
    const mockCategory: Category[] = [
      { _id: '1', name: '' }
    ];

    service.getCategoryById('1').subscribe(category => {
      expect(category).toEqual(mockCategory);
    });

    const req = httpMock.expectOne('http://localhost:3000/category/1');
    expect(req.request.method).toBe('GET');
    req.flush(mockCategory);
  });

  it('should add a category', () => {
    const mockResponse = { success: true };

    service.addCategory('Accesorios').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/category');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({ name: 'Accesorios' });
    req.flush(mockResponse);
  });

  it('should update a category', () => {
    const mockResponse = { success: true };

    service.updateCategory('1', 'Moda').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/category/1');
    expect(req.request.method).toBe('PUT');
    expect(req.request.body).toEqual({ name: 'Moda' });
    req.flush(mockResponse);
  });

  it('should delete a category', () => {
    const mockResponse = { success: true };

    service.deleteCategoryById('1').subscribe(response => {
      expect(response).toEqual(mockResponse);
    });

    const req = httpMock.expectOne('http://localhost:3000/category/1');
    expect(req.request.method).toBe('DELETE');
    req.flush(mockResponse);
  });

});
