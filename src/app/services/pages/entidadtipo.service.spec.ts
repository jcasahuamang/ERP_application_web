import { TestBed } from '@angular/core/testing';

import { EntidadtipoService } from './entidadtipo.service';

describe('EntidadtipoService', () => {
  let service: EntidadtipoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntidadtipoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
