import { TestBed } from '@angular/core/testing';

import { CheckAuthService } from './check-auth.service';

describe('CheckAuthService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CheckAuthService = TestBed.get(CheckAuthService);
    expect(service).toBeTruthy();
  });
});
