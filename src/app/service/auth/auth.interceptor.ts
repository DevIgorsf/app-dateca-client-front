import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpHeaders
} from '@angular/common/http';
import { Observable, catchError } from 'rxjs';
import { TokenService } from './token.service';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

  constructor(
    private tokenService: TokenService,
    private router: Router
    ) {}

  intercept(
    request: HttpRequest<unknown>,
    next: HttpHandler
    ): Observable<HttpEvent<unknown>> {
      if (request.url.includes('/login')) {
        return next.handle(request); // Não aplicar o interceptor durante o login
      }
      if (request.url.includes('/cadastro')) {
        return next.handle(request); // Não aplicar o interceptor durante o cadastro
      }
      if (this.tokenService.possuiToken()) {
        const token = this.tokenService.retornaToken();
        const headers = new HttpHeaders().set('authorization', 'Bearer ' + token);
        request = request.clone({ headers });
      }

      return next.handle(request).pipe(
        catchError((error: HttpErrorResponse) => {
          if (error.status === 401 || error.status === 403) {
            this.tokenService.excluiToken()
            this.router.navigate(['/login']);
          }
          return next.handle(request);
        })
      );
  }
}
