import { TestBed } from '@angular/core/testing';

import { JobInformationService } from './job-information.service';

describe('DataManagementService', () => {
  let service: JobInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobInformationService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
