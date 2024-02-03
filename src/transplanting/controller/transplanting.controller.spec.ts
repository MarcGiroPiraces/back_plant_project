import { Test, TestingModule } from '@nestjs/testing';
import { TransplantingService } from '../service/transplanting.service';
import { TransplantingController } from './transplanting.controller';

describe('TransplantingController', () => {
  let controller: TransplantingController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TransplantingController],
      providers: [TransplantingService],
    }).compile();

    controller = module.get<TransplantingController>(TransplantingController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
