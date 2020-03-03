import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GiftCardSinglePageComponent} from './gift-card-single-page.component';

describe('GiftCardSinglePageComponent', () => {
  let component: GiftCardSinglePageComponent;
  let fixture: ComponentFixture<GiftCardSinglePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GiftCardSinglePageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardSinglePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
