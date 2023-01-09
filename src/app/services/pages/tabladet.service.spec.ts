import { TestBed } from '@angular/core/testing';

import { TabladetService } from './tabladet.service';

describe('TabladetService', () => {
  let service: TabladetService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TabladetService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
