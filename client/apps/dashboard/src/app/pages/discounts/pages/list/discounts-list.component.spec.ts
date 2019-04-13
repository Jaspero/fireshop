import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DiscountsListComponent} from './discounts-list.component';

describe('DiscountsListComponent', () => {
  let component: DiscountsListComponent;
  let fixture: ComponentFixture<DiscountsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [DiscountsListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DiscountsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
