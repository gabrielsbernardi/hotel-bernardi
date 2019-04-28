import { TestBed } from '@angular/core/testing';

import { HospedeService } from './hospede.service';

describe('HospedeService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HospedeService = TestBed.get(HospedeService);
    expect(service).toBeTruthy();
  });
});
