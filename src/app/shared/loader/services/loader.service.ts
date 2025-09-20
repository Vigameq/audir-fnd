import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoaderService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$ = this.loadingSubject.asObservable();
  private activeRequests = 0;
  private delayTimer: any;

  show(delay = 200) {
    this.activeRequests++;

    if (!this.delayTimer) {
      this.delayTimer = setTimeout(() => {
        if (this.activeRequests > 0) {
          this.loadingSubject.next(true);
        }
      }, delay);
    }
  }

  hide() {
    this.activeRequests = Math.max(this.activeRequests - 1, 0);

    if (this.activeRequests === 0) {
      clearTimeout(this.delayTimer);
      this.delayTimer = null;
      this.loadingSubject.next(false);
    }
  }

  reset() {
    this.activeRequests = 0;
    this.loadingSubject.next(false);
  }
}
