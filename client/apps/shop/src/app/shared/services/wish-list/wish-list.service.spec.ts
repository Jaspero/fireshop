import {TestBed} from '@angular/core/testing';

import {WishListService} from './wish-list.service';

describe('WishListService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WishListService = TestBed.inject(WishListService);
    expect(service).toBeTruthy();
  });
});
