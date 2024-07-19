import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazonesSocialesComponent } from './razonesSociales.component'

describe('RazonesSocialesComponent', () => {
  let component: RazonesSocialesComponent;
  let fixture: ComponentFixture<RazonesSocialesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RazonesSocialesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RazonesSocialesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
