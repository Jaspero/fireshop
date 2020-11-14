import { TestBed, inject, waitForAsync } from '@angular/core/testing';

import { HasClaimGuard } from './has-claim.guard';

describe('HasClaimGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HasClaimGuard]
    });
  });

  it('should ...', inject([HasClaimGuard], (guard: HasClaimGuard) => {
    expect(guard).toBeTruthy();
  }));
});
