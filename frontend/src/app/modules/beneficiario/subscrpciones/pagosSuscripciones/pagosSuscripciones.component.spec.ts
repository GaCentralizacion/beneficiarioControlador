import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PagosSuscripcionesComponent } from './pagosSuscripciones.component';

describe('PagosSuscripcionesComponent', () => {
  let component: PagosSuscripcionesComponent;
  let fixture: ComponentFixture<PagosSuscripcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [PagosSuscripcionesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PagosSuscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
