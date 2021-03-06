import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { TriggerPasswordResetComponent } from './trigger-password-reset.component';

describe('TriggerPasswordResetComponent', () => {
  let component: TriggerPasswordResetComponent;
  let fixture: ComponentFixture<TriggerPasswordResetComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ TriggerPasswordResetComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TriggerPasswordResetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
