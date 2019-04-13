import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {NetworkWidgetComponent} from './network-widget.component';

describe('NetworkWidgetComponent', () => {
  let component: NetworkWidgetComponent;
  let fixture: ComponentFixture<NetworkWidgetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [NetworkWidgetComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NetworkWidgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
