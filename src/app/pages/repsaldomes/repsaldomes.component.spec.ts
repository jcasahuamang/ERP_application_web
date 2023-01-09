import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepsaldomesComponent } from './repsaldomes.component';

describe('RepsaldomesComponent', () => {
  let component: RepsaldomesComponent;
  let fixture: ComponentFixture<RepsaldomesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepsaldomesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepsaldomesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
