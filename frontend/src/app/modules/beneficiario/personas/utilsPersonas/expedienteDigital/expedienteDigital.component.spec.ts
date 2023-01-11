import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpedienteDigitalComponent } from './expedienteDigital.component';

describe('ExpedienteDigitalComponent', () => {
  let component: ExpedienteDigitalComponent;
  let fixture: ComponentFixture<ExpedienteDigitalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ExpedienteDigitalComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpedienteDigitalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
