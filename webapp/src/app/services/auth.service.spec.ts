import { TestBed } from '@angular/core/testing';
import { AuthService } from './auth.service';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { environment } from '../../environments/environment';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });

    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);

    localStorage.clear();
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // ==== REGISTER ====
  it('should call register API', () => {
    const mockResponse = { success: true };

    service.register('Juan', 'juan@test.com', '12345').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/auth/register');
    expect(req.request.method).toBe('POST');
    expect(req.request.body).toEqual({
      name: 'Juan',
      email: 'juan@test.com',
      password: '12345'
    });

    req.flush(mockResponse);
  });

  // ==== LOGIN ====
  it('should call login API', () => {
    const mockResponse = { token: 'ABC123' };

    service.login('test@test.com', '12345').subscribe(res => {
      expect(res).toEqual(mockResponse);
    });

    const req = httpMock.expectOne(environment.apiUrl + '/auth/login');
    expect(req.request.method).toBe('POST');
    req.flush(mockResponse);
  });

  // ==== isLoggedIn ====
  it('should return true when token exists', () => {
    localStorage.setItem('token', '123');
    expect(service.isLoggedIn).toBeTrue();
  });

  it('should return false when token does not exist', () => {
    expect(service.isLoggedIn).toBeFalse();
  });

  // ==== isAdmin ====
  it('should return admin status from user', () => {
    localStorage.setItem('user', JSON.stringify({ isAdmin: true }));
    expect(service.isAdmin).toBeTrue();
  });

  it('should return false when user does not exist', () => {
    expect(service.isAdmin).toBeFalse();
  });

  // ==== logout ====
  it('should remove token and user on logout', () => {
    localStorage.setItem('token', '123');
    localStorage.setItem('user', '{"name":"Test"}');

    service.logout();

    expect(localStorage.getItem('token')).toBeNull();
    expect(localStorage.getItem('user')).toBeNull();
  });
});
