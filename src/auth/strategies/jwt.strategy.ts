import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { CustomRequest } from 'src/CustomRequest';
import config from 'src/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: config.jwt.secret,
    });
  }

  async validate(
    payload: { sub: number; name: string; email: string },
    request: CustomRequest,
  ) {
    return {
      userId: payload.sub,
      name: payload.name,
      email: payload.email,
      request,
    };
  }
}