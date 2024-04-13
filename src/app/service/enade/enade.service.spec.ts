import { TestBed } from '@angular/core/testing';

import { EnadeService } from './enade.service';

describe('EnadeService', () => {
  let service: EnadeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnadeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
