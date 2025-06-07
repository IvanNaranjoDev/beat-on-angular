import { TestBed } from '@angular/core/testing';

import { InstrumentalService } from './instrumental.service';

describe('InstrumentalService', () => {
  let service: InstrumentalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstrumentalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
