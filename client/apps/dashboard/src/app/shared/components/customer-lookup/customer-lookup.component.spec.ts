import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomerLookupComponent} from './customer-lookup.component';

describe('CustomerLookupComponent', () => {
  let component: CustomerLookupComponent;
  let fixture: ComponentFixture<CustomerLookupComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomerLookupComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomerLookupComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
