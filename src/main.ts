import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { GlobalExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true, // lanza error si se envían propiedades extras
      transform: true, // transforma tipos automáticamente (por ejemplo, strings a numbers)
    }),
  );
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.enableCors();
  await app.listen(process.env.PORT ?? 3031);
}
bootstrap();
