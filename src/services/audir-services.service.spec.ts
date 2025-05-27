import { TestBed } from '@angular/core/testing';
import { AudirService } from './audir-services.service';

describe('AudirService', () => {
  let service: AudirService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AudirService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
