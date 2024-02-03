import { Test, TestingModule } from '@nestjs/testing';
import { PlantService } from '../service/plant.service';
import { PlantController } from './plant.controller';

describe('PlantController', () => {
  let controller: PlantController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PlantController],
      providers: [PlantService],
    }).compile();

    controller = module.get<PlantController>(PlantController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
