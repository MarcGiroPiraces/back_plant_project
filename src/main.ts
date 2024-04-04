import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';
import config from './config/config';
import { options, swaggerConfig } from './config/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  app.useGlobalPipes(new ValidationPipe({ transform: true, whitelist: true }));

  const document = SwaggerModule.createDocument(app, swaggerConfig, options);
  SwaggerModule.setup('api', app, document);

  await app.listen(config.port);
}
bootstrap();
