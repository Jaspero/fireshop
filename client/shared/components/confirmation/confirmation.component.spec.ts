import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ConfrimationComponent} from './confirmation.component';

describe('ConfrimationComponent', () => {
  let component: ConfrimationComponent;
  let fixture: ComponentFixture<ConfrimationComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ConfrimationComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfrimationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
