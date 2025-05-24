import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';
import { envs } from './config/envs';

async function bootstrap() {
  const logger = new Logger('Bootstrap');

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.NATS,
      options: {
        servers: envs.NATS_SERVERS,
      }
    }
  )

  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen();

  logger.log(`Microservice is listening on port ${envs.PORT}`);
}
bootstrap();
