import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TipotransaccionComponent } from './tipotransaccion.component';

describe('TipotransaccionComponent', () => {
  let component: TipotransaccionComponent;
  let fixture: ComponentFixture<TipotransaccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ TipotransaccionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TipotransaccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
