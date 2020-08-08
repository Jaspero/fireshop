import { TestBed } from '@angular/core/testing';

import { CustomModuleGuard } from './custom-module.guard';

describe('CustomModuleGuard', () => {
  let guard: CustomModuleGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(CustomModuleGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
