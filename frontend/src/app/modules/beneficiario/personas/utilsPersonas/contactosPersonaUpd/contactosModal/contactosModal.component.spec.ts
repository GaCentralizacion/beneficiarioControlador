import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosModalComponent } from './contactosModal.component';

describe('ContactosModalComponent', () => {
  let component: ContactosModalComponent;
  let fixture: ComponentFixture<ContactosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ContactosModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
