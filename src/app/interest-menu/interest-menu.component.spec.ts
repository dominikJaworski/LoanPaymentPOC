import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InterestMenuComponent } from './interest-menu.component';

describe('InterestMenuComponent', () => {
  let component: InterestMenuComponent;
  let fixture: ComponentFixture<InterestMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InterestMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InterestMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
