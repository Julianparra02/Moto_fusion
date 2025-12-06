import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductsComponent } from './products.component';
import { RouterTestingModule } from '@angular/router/testing';
import { ProductService } from '../../../services/product.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

// Mock ProductService
class MockProductService {
  getAllProducts() {
    return of([
      { id: '1', name: 'Producto A', description: 'Desc A', reference: 'REF123', price: 100 },
      { id: '2', name: 'Producto B', description: 'Desc B', reference: 'REF456', price: 200 }
    ]);
  }

  deleteProduct(id: string) {
    return of({ success: true });
  }
}

describe('ProductsComponent', () => {
  let component: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productService: ProductService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductsComponent,   
        RouterTestingModule,
        NoopAnimationsModule   // <-- 🔥 FIX para NG05105
      ],
      providers: [
        { provide: ProductService, useClass: MockProductService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductsComponent);
    component = fixture.componentInstance;
    productService = TestBed.inject(ProductService);

    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should load products on init', () => {
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].name).toBe('Producto A');
  });

  it('should apply filter to the table', () => {
    const event = { target: { value: 'producto' } } as any;

    component.applyFilter(event);

    expect(component.dataSource.filter).toBe('producto');
  });

  it('should delete a product and reload data', () => {
    const spyDelete = spyOn(productService, 'deleteProduct').and.callThrough();
    const spyReload = spyOn<any>(component, 'getServerData').and.callThrough();

    component.delete('1');

    expect(spyDelete).toHaveBeenCalledWith('1');
    expect(spyReload).toHaveBeenCalled();
  });

});
