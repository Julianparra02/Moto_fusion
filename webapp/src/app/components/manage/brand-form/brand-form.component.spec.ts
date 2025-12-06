import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BrandFormComponent } from './brand-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { BrandService } from '../../../services/brand.service';

class MockBrandService {
  getBrandById(id: string) {
    return of({ id, name: 'Nike' });
  }
  addBrand() {
    return of({});
  }
  updateBrand() {
    return of({});
  }
}

describe('BrandFormComponent', () => {
  let component: BrandFormComponent;
  let fixture: ComponentFixture<BrandFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        BrandFormComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: BrandService, useClass: MockBrandService },

        // 💥 NECESARIO PARA EVITAR EL NG0205
        { provide: Router, useValue: {
            navigateByUrl: jasmine.createSpy('navigateByUrl'),
            navigate: jasmine.createSpy('navigate')
        }},

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(BrandFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
