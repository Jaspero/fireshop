import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CheckoutErrorComponent} from './checkout-error.component';

describe('CheckoutErrorComponent', () => {
  let component: CheckoutErrorComponent;
  let fixture: ComponentFixture<CheckoutErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CheckoutErrorComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckoutErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
