import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Enable CORS for React Native frontend
  app.enableCors({
    origin: [
      'http://localhost:8081',
      'http://localhost:19000',
      'http://localhost:19006',
      'exp://localhost:19000',
      'http://10.0.2.2:8081',  // Android emulator
      'http://10.0.2.2:19000', // Android emulator
      'http://10.0.2.2:19006', // Android emulator
      'exp://10.0.2.2:19000',  // Android emulator
      'exp://192.168.',        // Android on physical device
    ],
    credentials: true,
  });

  // Set global prefix
  app.setGlobalPrefix('api');

  // Enable validation
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  await app.listen(process.env.PORT ?? 3000);
  console.log(`Application is running on: http://localhost:${process.env.PORT || 3000}`);
}
bootstrap();
