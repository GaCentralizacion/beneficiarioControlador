import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ShowIndirectosComponent } from './showIndirectos.component';

describe('ShowIndirectosComponent', () => {
  let component: ShowIndirectosComponent;
  let fixture: ComponentFixture<ShowIndirectosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ShowIndirectosComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ShowIndirectosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
