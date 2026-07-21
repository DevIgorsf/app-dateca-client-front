import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ToastrService } from 'ngx-toastr';

import { AuthInterceptor } from './auth.interceptor';

describe('AuthInterceptor', () => {
  beforeEach(() => TestBed.configureTestingModule({
    imports: [RouterTestingModule],
    providers: [
      AuthInterceptor,
      { provide: ToastrService, useValue: { error: () => {} } }
      ]
  }));

  it('should be created', () => {
    const interceptor: AuthInterceptor = TestBed.inject(AuthInterceptor);
    expect(interceptor).toBeTruthy();
  });
});
