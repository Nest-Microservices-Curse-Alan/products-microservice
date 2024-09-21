import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { envs } from './config';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const logger = new Logger('main');
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.TCP,
      options:{
        port: envs.port
      }
    }
  );

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,               // Filtra los campos que no están en el DTO
      forbidNonWhitelisted: true,     // Lanza un error si se envían campos no válidos
      transform: true,                // Habilita la transformación automática de tipos (e.g., string a number)
      transformOptions: {             // Opcional, para mayor precisión
        enableImplicitConversion: true,  // Permite la conversión implícita de tipos
      },
    })
  );

  await app.listen();

  logger.log(`Products Microservice is running on: ${envs.port}`);
}
bootstrap();
