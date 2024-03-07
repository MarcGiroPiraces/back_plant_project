import { User } from './user/entities/user.entity';

export interface CustomRequest extends Request {
  user: Partial<User>;
  startTime: Date;
}
