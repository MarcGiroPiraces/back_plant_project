import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from 'src/config/config';
import { Role } from '../../user/entities/user.entity';
import { UserRepository } from '../../user/repository/user.repository';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserRepository) private userRepository: UserRepository) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(payload: {
    id: number;
    name: string;
    email: string;
    role: Role;
  }) {
    const user = await this.userRepository.findOneByEmail(payload.email);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
      role: user.role,
    };
  }
}
