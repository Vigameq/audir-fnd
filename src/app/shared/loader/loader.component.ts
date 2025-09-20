import { Component, OnInit } from '@angular/core';
import { LoaderService } from './services/loader.service';
import { Observable, timer } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { trigger, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms ease-in', style({ opacity: 1 })),
      ]),
      transition(':leave', [
        animate('300ms ease-out', style({ opacity: 0 })),
      ]),
    ])
  ]
})
export class LoaderComponent implements OnInit {
  loading$!: Observable<boolean>;
  constructor(public loaderService: LoaderService) { }

  ngOnInit() {
    this.loading$ = this.loaderService.isLoading$.pipe(
      switchMap(show => {
        if (!show) return [false];
        return timer(250).pipe(switchMap(() => [true]));
      })
    );
  }
}
