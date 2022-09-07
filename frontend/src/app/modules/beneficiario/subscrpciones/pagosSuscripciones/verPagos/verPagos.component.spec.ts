import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerPagosComponent } from './verPagos.component';

describe('VerPagosComponent', () => {
  let component: VerPagosComponent;
  let fixture: ComponentFixture<VerPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [VerPagosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
