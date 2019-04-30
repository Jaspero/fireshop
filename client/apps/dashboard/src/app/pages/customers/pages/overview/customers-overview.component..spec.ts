import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CustomersOverviewComponent} from './customers-overview.component.';

describe('CustomersOverviewComponent', () => {
  let component: CustomersOverviewComponent;
  let fixture: ComponentFixture<CustomersOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CustomersOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CustomersOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
