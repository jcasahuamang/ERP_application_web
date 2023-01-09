import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RepalmasaldocieComponent } from './repalmasaldocie.component';

describe('RepalmasaldocieComponent', () => {
  let component: RepalmasaldocieComponent;
  let fixture: ComponentFixture<RepalmasaldocieComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RepalmasaldocieComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RepalmasaldocieComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
