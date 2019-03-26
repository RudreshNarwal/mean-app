import { HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';

import { AuthService } from './auth.service';

@Injectable()  // so that we can inject services in this service
export class AuthInterceptor implements HttpInterceptor {
  constructor(private authService: AuthService) {}

  intercept(req: HttpRequest<any>, next) { // angular will check this method for the request leaving the app
         // any for all kind of request  // next allow us to leave the interceptor and to allow the other method to take the request
      const authToken = this.authService.getToken();
      const authRequest = req.clone({
        headers: req.headers.set('Authorization', 'Bearer ' + authToken)
      });
      return next.handle(authRequest);
  }
}
