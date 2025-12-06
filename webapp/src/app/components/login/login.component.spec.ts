import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { AuthService } from '../../services/auth.service';
import { of } from 'rxjs';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';

// Mock del AuthService
class MockAuthService {
  login(email: string, password: string) {
    return of({ token: '123', user: { name: 'Test' } });
  }
}

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        LoginComponent,
        RouterTestingModule,
        NoopAnimationsModule  // 💥 FIX DEL ERROR @transitionMessages
      ],
      providers: [
        { provide: AuthService, useClass: MockAuthService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('form should be invalid when empty', () => {
    component.loginForm.setValue({ email: '', password: '' });
    expect(component.loginForm.valid).toBeFalse();
  });

  it('should have a form with email and password controls', () => {
    expect(component.loginForm.contains('email')).toBeTrue();
    expect(component.loginForm.contains('password')).toBeTrue();
  });

  it('should call authService.login when login() is executed', () => {
    const spyLogin = spyOn(authService, 'login').and.callThrough();
    const spyNav = spyOn(component.router, 'navigateByUrl');

    component.loginForm.setValue({
      email: 'test@test.com',
      password: '12345'
    });

    component.login();

    expect(spyLogin).toHaveBeenCalledWith('test@test.com', '12345');
    expect(spyNav).toHaveBeenCalledWith('/');
  });

  it('should navigate after successful login', () => {
    const spyNav = spyOn(component.router, 'navigateByUrl');

    component.loginForm.setValue({
      email: 'test@test.com',
      password: '12345'
    });

    component.login();

    expect(spyNav).toHaveBeenCalledWith('/');
  });
});
