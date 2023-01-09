import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CcostoComponent } from './ccosto.component';

describe('CcostoComponent', () => {
  let component: CcostoComponent;
  let fixture: ComponentFixture<CcostoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CcostoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CcostoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
