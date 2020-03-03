import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GiftCardOverviewComponent} from './gift-card-overview.component';

describe('GiftCardOverviewComponent', () => {
  let component: GiftCardOverviewComponent;
  let fixture: ComponentFixture<GiftCardOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GiftCardOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
