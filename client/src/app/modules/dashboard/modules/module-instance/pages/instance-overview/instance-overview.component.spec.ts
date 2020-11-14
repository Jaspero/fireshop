import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {InstanceOverviewComponent} from './instance-overview.component';

describe('InstanceOverviewComponent', () => {
  let component: InstanceOverviewComponent;
  let fixture: ComponentFixture<InstanceOverviewComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [InstanceOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InstanceOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
