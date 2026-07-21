import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpHeaders, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private router: Router,
    private toastr: ToastrService
    ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
      const isAuthExempt = request.url.includes('/login') || request.url.includes('/cadastro');

      if (!isAuthExempt && this.tokenService.possuiToken()) {
        const token = this.tokenService.retornaToken();
        const headers = new HttpHeaders().set('authorization', 'Bearer ' + token);
        request = request.clone({ headers });
      }

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 0) {
            this.toastr.error('Serviço temporariamente fora do ar. Tente novamente mais tarde.');
            return throwError(() => error);
          }
          if (!isAuthExempt && (error.status === 401 || error.status === 403)) {
            this.tokenService.excluiToken()
            this.router.navigate(['/login']);
            return next.handle(request);
          }
          return throwError(() => error);
        })
      );
  }
}
