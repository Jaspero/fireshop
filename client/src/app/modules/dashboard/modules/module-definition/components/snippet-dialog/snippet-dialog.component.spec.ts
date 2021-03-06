import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { SnippetDialogComponent } from './snippet-dialog.component';

describe('SnippetDialogComponent', () => {
  let component: SnippetDialogComponent;
  let fixture: ComponentFixture<SnippetDialogComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ SnippetDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SnippetDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
