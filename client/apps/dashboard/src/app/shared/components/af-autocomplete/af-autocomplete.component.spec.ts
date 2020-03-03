import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {AfAutocompleteComponent} from './af-autocomplete.component';

describe('AfAutocompleteComponent', () => {
  let component: AfAutocompleteComponent;
  let fixture: ComponentFixture<AfAutocompleteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [AfAutocompleteComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AfAutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
