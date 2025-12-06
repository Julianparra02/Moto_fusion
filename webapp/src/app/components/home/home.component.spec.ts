import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomeComponent } from './home.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CustomerService } from '../../services/customer.service';
import { of } from 'rxjs';

class MockCustomerService {
  getOffers() {
    return of([]);
  }
  getCategories() {
    return of([]);
  }
  getProducts() {
    return of([]);
  }
  getFeaturedProducts() {
    return of([]);
  }
  getNewProducts() {   // <-- FIX
    return of([]);
  }
}

describe('HomeComponent', () => {
  let component: HomeComponent;
  let fixture: ComponentFixture<HomeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HomeComponent,
        RouterTestingModule,
        HttpClientTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CustomerService, useClass: MockCustomerService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(HomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ejecuta ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
