import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SaleListComponent} from './sale-list.component';

describe('SaleListComponent', () => {
  let component: SaleListComponent;
  let fixture: ComponentFixture<SaleListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaleListComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
