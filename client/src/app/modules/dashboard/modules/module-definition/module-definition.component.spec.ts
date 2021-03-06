import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import {ModuleDefinitionComponent} from './module-definition.component';

describe('ModuleDefinitionComponent', () => {
  let component: ModuleDefinitionComponent;
  let fixture: ComponentFixture<ModuleDefinitionComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ModuleDefinitionComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModuleDefinitionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
