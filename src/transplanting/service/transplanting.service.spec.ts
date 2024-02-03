import { Test, TestingModule } from '@nestjs/testing';
import { TransplantingService } from './transplanting.service';

describe('TransplantingService', () => {
  let service: TransplantingService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TransplantingService],
    }).compile();

    service = module.get<TransplantingService>(TransplantingService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
