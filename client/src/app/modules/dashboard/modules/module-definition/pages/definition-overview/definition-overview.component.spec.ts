import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {DefinitionOverviewComponent} from './definition-overview.component';

describe('DefinitionOverviewComponent', () => {
  let component: DefinitionOverviewComponent;
  let fixture: ComponentFixture<DefinitionOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [DefinitionOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DefinitionOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
