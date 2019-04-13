import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {OrdersSinglePageComponent} from './orders-single-page.component';

describe('CustomersSinglePageComponent', () => {
  let component: OrdersSinglePageComponent;
  let fixture: ComponentFixture<OrdersSinglePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [OrdersSinglePageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(OrdersSinglePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
