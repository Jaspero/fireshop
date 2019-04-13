import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ProductsSinglePageComponent} from './products-single-page.component';

describe('CustomersSinglePageComponent', () => {
  let component: ProductsSinglePageComponent;
  let fixture: ComponentFixture<ProductsSinglePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ProductsSinglePageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsSinglePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
