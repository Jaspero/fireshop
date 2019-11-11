import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CompiledFormComponent } from './compiled-form.component';

describe('CompiledFormComponent', () => {
  let component: CompiledFormComponent;
  let fixture: ComponentFixture<CompiledFormComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CompiledFormComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CompiledFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
