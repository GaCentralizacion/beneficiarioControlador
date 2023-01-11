import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSubscripcionesComponent } from './addSubscripciones.component';

describe('AddSubscripcionesComponent', () => {
  let component: AddSubscripcionesComponent;
  let fixture: ComponentFixture<AddSubscripcionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddSubscripcionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSubscripcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
