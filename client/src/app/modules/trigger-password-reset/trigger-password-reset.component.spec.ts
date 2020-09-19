import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {TriggerPasswordResetComponent} from './trigger-password-reset.component';

describe('ResetPasswordComponent', () => {
  let component: TriggerPasswordResetComponent;
  let fixture: ComponentFixture<TriggerPasswordResetComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [TriggerPasswordResetComponent]
    }).compileComponents();
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
