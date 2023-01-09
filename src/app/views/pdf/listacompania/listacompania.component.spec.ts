import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ListacompaniaComponent } from './listacompania.component';

describe('ListacompaniaComponent', () => {
  let component: ListacompaniaComponent;
  let fixture: ComponentFixture<ListacompaniaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ListacompaniaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ListacompaniaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
