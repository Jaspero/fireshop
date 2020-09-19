import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {InstanceOverviewComponent} from './instance-overview.component';

describe('InstanceOverviewComponent', () => {
  let component: InstanceOverviewComponent;
  let fixture: ComponentFixture<InstanceOverviewComponent>;

  beforeEach(async(() => {
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
