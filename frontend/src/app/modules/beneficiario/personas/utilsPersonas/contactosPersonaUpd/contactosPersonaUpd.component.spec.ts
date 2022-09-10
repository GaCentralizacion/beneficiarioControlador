import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ContactosPersonaUpdComponent } from './contactosPersonaUpd.component';

describe('ContactosPersonaUpdComponent', () => {
  let component: ContactosPersonaUpdComponent;
  let fixture: ComponentFixture<ContactosPersonaUpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ContactosPersonaUpdComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ContactosPersonaUpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
