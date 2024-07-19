import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RazonesSocialesUpdComponent } from './razonesSocialesUpd.component'

describe('RazonesSocialesUpdComponent', () => {
  let component: RazonesSocialesUpdComponent;
  let fixture: ComponentFixture<RazonesSocialesUpdComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RazonesSocialesUpdComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RazonesSocialesUpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
