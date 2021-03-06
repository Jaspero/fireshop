import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { CanReadModuleGuard } from './can-read-module.guard';

describe('CanReadModuleGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CanReadModuleGuard]
    });
  });

  it('should ...', inject([CanReadModuleGuard], (guard: CanReadModuleGuard) => {
    expect(guard).toBeTruthy();
  }));
});
