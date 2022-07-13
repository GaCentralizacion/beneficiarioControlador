import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AccionistaComponent } from './accionista.component'

describe('AccionistaComponent', () => {
  let component: AccionistaComponent;
  let fixture: ComponentFixture<AccionistaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AccionistaComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AccionistaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
