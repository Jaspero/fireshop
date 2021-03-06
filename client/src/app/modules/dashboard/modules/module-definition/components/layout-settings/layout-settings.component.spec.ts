import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { LayoutSettingsComponent } from './layout-settings.component';

describe('LayoutSettingsComponent', () => {
  let component: LayoutSettingsComponent;
  let fixture: ComponentFixture<LayoutSettingsComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ LayoutSettingsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LayoutSettingsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
