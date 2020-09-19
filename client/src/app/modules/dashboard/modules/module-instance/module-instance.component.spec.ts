import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ModuleInstanceComponent} from './module-instance.component';

describe('ModuleInstanceComponent', () => {
  let component: ModuleInstanceComponent;
  let fixture: ComponentFixture<ModuleInstanceComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ModuleInstanceComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleInstanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
