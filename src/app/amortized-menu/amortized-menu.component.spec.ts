import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AmortizedMenuComponent } from './amortized-menu.component';

describe('AmortizedMenuComponent', () => {
  let component: AmortizedMenuComponent;
  let fixture: ComponentFixture<AmortizedMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AmortizedMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AmortizedMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
