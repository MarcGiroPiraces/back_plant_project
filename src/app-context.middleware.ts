import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Response } from 'express';
import { CustomRequest } from './CustomRequest';
import { User } from './user/entities/user.entity';

@Injectable()
export class AppContextMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    (req.user = {} as Partial<User>), (req.startTime = new Date());
    next();
  }
}
