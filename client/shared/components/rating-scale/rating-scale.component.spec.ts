import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {RatingScaleComponent} from './rating-scale.component';

describe('RatingScaleComponent', () => {
  let component: RatingScaleComponent;
  let fixture: ComponentFixture<RatingScaleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [RatingScaleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RatingScaleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
