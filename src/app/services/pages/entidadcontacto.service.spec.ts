import { TestBed } from '@angular/core/testing';

import { EntidadcontactoService } from './entidadcontacto.service';

describe('EntidadcontactoService', () => {
  let service: EntidadcontactoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EntidadcontactoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
