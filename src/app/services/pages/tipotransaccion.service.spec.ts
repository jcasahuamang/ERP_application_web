import { TestBed } from '@angular/core/testing';

import { TipotransaccionService } from './tipotransaccion.service';

describe('TipotransaccionService', () => {
  let service: TipotransaccionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TipotransaccionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
