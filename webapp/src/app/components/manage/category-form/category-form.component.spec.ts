import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoryFormComponent } from './category-form.component';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { CategoryServices } from '../../../services/category.service';

class MockCategoryService {
  getCategoryById(id: string) {
    return of({ id, name: 'Test Category' });
  }

  addCategory() {
    return of({});
  }

  updateCategory() {
    return of({});
  }
}

describe('CategoryFormComponent', () => {
  let component: CategoryFormComponent;
  let fixture: ComponentFixture<CategoryFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CategoryFormComponent,
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule
      ],
      providers: [
        { provide: CategoryServices, useClass: MockCategoryService },

        // 🔥 PREVIENE COMPLETAMENTE EL ERROR NG0205
        { 
          provide: Router, 
          useValue: {
            navigate: jasmine.createSpy('navigate'),
            navigateByUrl: jasmine.createSpy('navigateByUrl'),
          } 
        },

        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: { params: {} }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoryFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();  // ejecuta ngOnInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
