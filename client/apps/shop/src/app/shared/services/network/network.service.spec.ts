import {TestBed} from '@angular/core/testing';

import {NetworkService} from './network.service';

describe('NetworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: NetworkService = TestBed.inject(NetworkService);
    expect(service).toBeTruthy();
  });
});
