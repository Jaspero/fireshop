import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewPrepopulateComponent } from './new-prepopulate.component';

describe('NewPrepopulateComponent', () => {
  let component: NewPrepopulateComponent;
  let fixture: ComponentFixture<NewPrepopulateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewPrepopulateComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewPrepopulateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
