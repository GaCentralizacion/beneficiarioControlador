import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAccionesComponent } from './addAcciones.component';

describe('AddAccionesComponent', () => {
  let component: AddAccionesComponent;
  let fixture: ComponentFixture<AddAccionesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddAccionesComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAccionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
