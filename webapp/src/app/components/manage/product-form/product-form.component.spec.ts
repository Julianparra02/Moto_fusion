import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ProductFormComponent } from './product-form.component';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { ProductService } from '../../../services/product.service';
import { BrandService } from '../../../services/brand.service';

// === MOCK SERVICES ===
class MockProductService {
  getProductById() { return of(null); }
  addProduct() { return of({}); }
  updateProduct() { return of({}); }
}

class MockBrandService {
  getBrands() { return of([]); }
}

class MockCategoryService {
  getCategories() { return of([]); }
}

describe('ProductFormComponent', () => {
  let component: ProductFormComponent;
  let fixture: ComponentFixture<ProductFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ProductFormComponent, 
        ReactiveFormsModule,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: ProductService, useClass: MockProductService },
        { provide: BrandService, useClass: MockBrandService },
        { provide: MockCategoryService, useClass: MockCategoryService },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},              // <-- evita error al leer route.snapshot.params.id
              paramMap: {
                get: () => null       // <-- por si se usa paramMap.get('id')
              }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ProductFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create component', () => {
    expect(component).toBeTruthy();
  });

  it('should add a new image control', () => {
    const initialCount = component.images.length;
    component.addImage();
    expect(component.images.length).toBe(initialCount + 1);
  });

  it('should add a compatibility group', () => {
    const initialCount = component.compatibilidad.length;
    component.addCompatibility();
    expect(component.compatibilidad.length).toBe(initialCount + 1);
  });

  it('should remove an image control when more than 1', () => {
    component.addImage();
    const initial = component.images.length;
    component.removeImage();
    expect(component.images.length).toBe(initial - 1);
  });

  it('should remove compatibility when more than 1', () => {
    component.addCompatibility();
    const initial = component.compatibilidad.length;
    component.removeCompatibility(0);
    expect(component.compatibilidad.length).toBe(initial - 1);
  });

});
