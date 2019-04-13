import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomersSinglePageComponent} from './customers-single-page.component';

describe('CustomersSinglePageComponent', () => {
  let component: CustomersSinglePageComponent;
  let fixture: ComponentFixture<CustomersSinglePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomersSinglePageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersSinglePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
