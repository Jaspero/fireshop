import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DiscountsSinglePageComponent} from './discounts-single-page.component';

describe('DiscountsSinglePageComponent', () => {
  let component: DiscountsSinglePageComponent;
  let fixture: ComponentFixture<DiscountsSinglePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountsSinglePageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsSinglePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
