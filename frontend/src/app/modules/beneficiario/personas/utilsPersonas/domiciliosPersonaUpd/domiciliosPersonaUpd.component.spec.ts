import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DomiciliosPersonaUpdComponent } from './domiciliosPersonaUpd.component';

describe('DomiciliosPersonaUpdComponent', () => {
  let component: DomiciliosPersonaUpdComponent;
  let fixture: ComponentFixture<DomiciliosPersonaUpdComponent>;
  DomiciliosPersonaUpdComponent
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DomiciliosPersonaUpdComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DomiciliosPersonaUpdComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
