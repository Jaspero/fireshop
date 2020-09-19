import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LayoutSettingsComponent } from './layout-settings.component';

describe('LayoutSettingsComponent', () => {
  let component: LayoutSettingsComponent;
  let fixture: ComponentFixture<LayoutSettingsComponent>;

  beforeEach(async(() => {
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
