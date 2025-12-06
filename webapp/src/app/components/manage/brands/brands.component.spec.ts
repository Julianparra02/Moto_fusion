import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandsComponent } from './brands.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BrandService } from '../../../services/brand.service';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

// Mock del BrandService
class MockBrandService {
  getBrands() {
    return of([
      { id: '1', name: 'Nike' },
      { id: '2', name: 'Adidas' }
    ]);
  }

  deleteBrandById(id: string) {
    return of({ success: true });
  }
}

describe('BrandsComponent', () => {
  let component: BrandsComponent;
  let fixture: ComponentFixture<BrandsComponent>;
  let brandService: BrandService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrandsComponent,           // Standalone component
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule       // <-- FIX ANIMACIONES
      ],
      providers: [
        { provide: BrandService, useClass: MockBrandService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandsComponent);
    component = fixture.componentInstance;
    brandService = TestBed.inject(BrandService);
    fixture.detectChanges(); 
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load brands on init', () => {
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].name).toBe('Nike');
  });

  it('should filter data when applyFilter is called', () => {
    const event = { target: { value: 'nike' } } as any;

    component.applyFilter(event);

    expect(component.dataSource.filter).toBe('nike');
  });

  it('should delete brand and reload data', () => {
    const spyGetServerData = spyOn<any>(component, 'getServerData').and.callThrough();
    const spyDelete = spyOn(brandService, 'deleteBrandById').and.callThrough();

    component.delete('1');

    expect(spyDelete).toHaveBeenCalledWith('1');
    expect(spyGetServerData).toHaveBeenCalled();
  });
});
