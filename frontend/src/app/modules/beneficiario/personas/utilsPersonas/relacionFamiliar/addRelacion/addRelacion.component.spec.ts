import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRelacionComponent } from './addRelacion.component';

describe('AddRelacionComponent', () => {
  let component: AddRelacionComponent;
  let fixture: ComponentFixture<AddRelacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AddRelacionComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
