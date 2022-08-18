import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RelacionFamiliarComponent } from './relacionFamiliar.component';

describe('RelacionFamiliarComponent', () => {
  let component: RelacionFamiliarComponent;
  let fixture: ComponentFixture<RelacionFamiliarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RelacionFamiliarComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RelacionFamiliarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
