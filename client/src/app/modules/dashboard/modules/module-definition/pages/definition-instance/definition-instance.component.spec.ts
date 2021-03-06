import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DefinitionInstanceComponent} from './definition-instance.component';

describe('DefinitionInstanceComponent', () => {
  let component: DefinitionInstanceComponent;
  let fixture: ComponentFixture<DefinitionInstanceComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DefinitionInstanceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
