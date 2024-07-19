import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalDocsMultiplesComponent } from './modalDocsMultiples.component'

describe('ModalDocsMultiplesComponent', () => {
  let component: ModalDocsMultiplesComponent;
  let fixture: ComponentFixture<ModalDocsMultiplesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ModalDocsMultiplesComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalDocsMultiplesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
