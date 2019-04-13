import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CategoriesSinglePageComponent} from './categories-single-page.component';

describe('CategoriesSinglePageComponent', () => {
  let component: CategoriesSinglePageComponent;
  let fixture: ComponentFixture<CategoriesSinglePageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [CategoriesSinglePageComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CategoriesSinglePageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
