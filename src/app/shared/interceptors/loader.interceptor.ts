import { Injectable } from '@angular/core';
import {
  HttpEvent, HttpInterceptor, HttpHandler, HttpRequest
} from '@angular/common/http';
import { Observable, finalize } from 'rxjs';
import { LoaderService } from '../loader/services/loader.service';

@Injectable()
export class LoaderInterceptor implements HttpInterceptor {
  constructor(private loaderService: LoaderService) { }

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const skip = req.headers.get('X-Skip-Loader');
    if (!skip) {
    this.loaderService.show();
    }

    return next.handle(req).pipe(
      finalize(() => {
        if (!skip) {
          this.loaderService.hide();
        }
      })
    );
  }
}
