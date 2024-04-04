import { DocumentBuilder, SwaggerDocumentOptions } from '@nestjs/swagger';

export const options: SwaggerDocumentOptions = {
  operationIdFactory: (controllerKey: string, methodKey: string) => methodKey,
};

export const swaggerConfig = new DocumentBuilder()
  .addBearerAuth()
  .setTitle('Plant Scheduler API')
  .setDescription('API for managing plants and their watering schedule.')
  .setVersion('1.0')
  .build();
