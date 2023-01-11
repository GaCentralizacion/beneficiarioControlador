import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PagarSuscripcionComponent } from './pagarSuscripcion.component';

describe('PagarSuscripcionComponent', () => {
  let component: PagarSuscripcionComponent;
  let fixture: ComponentFixture<PagarSuscripcionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [PagarSuscripcionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PagarSuscripcionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
