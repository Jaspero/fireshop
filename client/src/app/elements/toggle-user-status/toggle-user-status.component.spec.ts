import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ToggleUserStatusComponent } from './toggle-user-status.component';

describe('ToggleUserStatusComponent', () => {
  let component: ToggleUserStatusComponent;
  let fixture: ComponentFixture<ToggleUserStatusComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ToggleUserStatusComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ToggleUserStatusComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
