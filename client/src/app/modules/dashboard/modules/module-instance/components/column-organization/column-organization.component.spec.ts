import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColumnOrganizationComponent } from './column-organization.component';

describe('ColumnOrganizationComponent', () => {
  let component: ColumnOrganizationComponent;
  let fixture: ComponentFixture<ColumnOrganizationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ColumnOrganizationComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ColumnOrganizationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
