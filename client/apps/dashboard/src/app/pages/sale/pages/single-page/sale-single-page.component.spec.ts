import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {SaleSinglePageComponent} from './sale-single-page.component';

describe('SaleSinglePageComponent', () => {
  let component: SaleSinglePageComponent;
  let fixture: ComponentFixture<SaleSinglePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [SaleSinglePageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SaleSinglePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
