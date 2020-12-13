import { Controller, Get } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { TasksModule } from './tasks.module';

const MOCKED_RESULT = 'this is a mock controler';

@Controller('mockController')
class MockedController {
  constructor() {}

  @Get()
  findAll(): string {
    return MOCKED_RESULT;
  }
}

describe('TasksModule', () => {
  let mockController: MockedController;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      controllers: [MockedController],
      providers: [TasksModule],
    }).compile();

    mockController = module.get<MockedController>(MockedController);
  });

  it('should load a controller with using TaskModule', () => {
    const findAllResult = mockController.findAll();

    expect(findAllResult).toEqual(MOCKED_RESULT);
  });
});
