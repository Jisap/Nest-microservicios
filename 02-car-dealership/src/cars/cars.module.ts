import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  controllers: [CarsController],
  providers: [CarsService]          // Los servicios son providers, pero no todos los providers son servicios
})
export class CarsModule {}
