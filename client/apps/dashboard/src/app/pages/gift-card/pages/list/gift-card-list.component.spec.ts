import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {GiftCardListComponent} from './gift-card-list.component';

describe('GiftCardListComponent', () => {
  let component: GiftCardListComponent;
  let fixture: ComponentFixture<GiftCardListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [GiftCardListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GiftCardListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
