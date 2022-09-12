import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomiciliosModalComponent } from './domiciliosModal.component';

describe('DomiciliosModalComponent', () => {
  let component: DomiciliosModalComponent;
  let fixture: ComponentFixture<DomiciliosModalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DomiciliosModalComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomiciliosModalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
