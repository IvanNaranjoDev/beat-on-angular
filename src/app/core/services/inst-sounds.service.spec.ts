import { TestBed } from '@angular/core/testing';

import { InstSoundsService } from './ints-sounds.service';

describe('InsSoundsService', () => {
  let service: InstSoundsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InstSoundsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
