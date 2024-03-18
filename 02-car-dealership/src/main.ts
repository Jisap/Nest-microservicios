import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function main() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(                 // Se configura para permitir solo propiedades que están definidas en las clases DTO
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
    }),  
  )

  await app.listen(3000);
}
main();
