import {TestBed, async, inject} from '@angular/core/testing';

import {CheckoutCompleteGuard} from './checkout-complete.guard';

describe('CheckoutCompleteGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CheckoutCompleteGuard]
    });
  });

  it('should ...', inject(
    [CheckoutCompleteGuard],
    (guard: CheckoutCompleteGuard) => {
      expect(guard).toBeTruthy();
    }
  ));
});
