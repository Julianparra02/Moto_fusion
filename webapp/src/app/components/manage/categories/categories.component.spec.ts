import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CategoriesComponent } from './categories.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { CategoryServices } from '../../../services/category.service';
import { of } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

// Mock del servicio
class MockCategoryService {
  getCategories() {
    return of([
      { id: '1', name: 'Electronics' },
      { id: '2', name: 'Clothing' }
    ]);
  }

  deleteCategoryById(id: string) {
    return of({ success: true });
  }
}

describe('CategoriesComponent', () => {
  let component: CategoriesComponent;
  let fixture: ComponentFixture<CategoriesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        CategoriesComponent,       
        HttpClientTestingModule,
        RouterTestingModule,
        NoopAnimationsModule        // 💥 evita NG05105 (@transitionMessages)
      ],
      providers: [
        { provide: CategoryServices, useClass: MockCategoryService },

        // 💥 evita NullInjectorError: ActivatedRoute
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {
              params: {},
              paramMap: { get: () => null }
            }
          }
        }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(CategoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges(); // ejecuta ngOnInit()
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load categories on init', () => {
    expect(component.dataSource.data.length).toBe(2);
    expect(component.dataSource.data[0].name).toBe('Electronics');
  });

  it('should filter data when applyFilter is called', () => {
    const event = { target: { value: 'elect' } } as any;

    component.applyFilter(event);

    expect(component.dataSource.filter).toBe('elect');
  });

  it('should call deleteCategoryById when delete is called', () => {
    const spy = spyOn(component['CategoryServices'], 'deleteCategoryById').and.callThrough();
    const spyReload = spyOn<any>(component, 'getServerData').and.callThrough();

    component.delete('1');

    expect(spy).toHaveBeenCalledWith('1');
    expect(spyReload).toHaveBeenCalled();
  });
});
