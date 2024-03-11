import { Test, TestingModule } from '@nestjs/testing';
import { FriendRequestsController } from './friendRequests.controller';

describe('FriendRequestsController', () => {
  let controller: FriendRequestsController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FriendRequestsController],
    }).compile();

    controller = module.get<FriendRequestsController>(FriendRequestsController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
