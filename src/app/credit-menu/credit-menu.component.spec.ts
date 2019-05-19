import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CreditMenuComponent } from './credit-menu.component';

describe('CreditMenuComponent', () => {
  let component: CreditMenuComponent;
  let fixture: ComponentFixture<CreditMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreditMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreditMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
