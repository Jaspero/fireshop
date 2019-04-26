import {TestBed, async, inject} from '@angular/core/testing';

import {CheckOutGuard} from './check-out.guard';

describe('CheckOutGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckOutGuard]
    });
  });

  it('should ...', inject([CheckOutGuard], (guard: CheckOutGuard) => {
    expect(guard).toBeTruthy();
  }));
});
