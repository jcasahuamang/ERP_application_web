import { TestBed } from '@angular/core/testing';

import { CcostoService } from './ccosto.service';

describe('CcostoService', () => {
  let service: CcostoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CcostoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
