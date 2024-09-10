import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { organizationAccessGuard } from './organization-access.guard';

describe('organizationAccessGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => organizationAccessGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
