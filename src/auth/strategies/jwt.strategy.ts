import { Inject, Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import config from 'src/config';
import { UserService } from '../../user/service/user.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(@Inject(UserService) private userRepository: UserService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(payload: { id: number; name: string; email: string }) {
    const user = await this.userRepository.findOneByEmailRepo(payload.email);
    if (!user) {
      throw new Error('User not found');
    }

    return {
      id: payload.id,
      name: payload.name,
      email: payload.email,
    };
  }
}
