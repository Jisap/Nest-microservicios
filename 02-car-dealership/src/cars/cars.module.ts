import { Module } from '@nestjs/common';
import { CarsController } from './cars.controller';
import { CarsService } from './cars.service';

@Module({
  controllers: [CarsController],
  providers: [CarsService],          // Los servicios son providers, pero no todos los providers son servicios
  exports: [CarsService],            // Se podrá usar fuera de CarsModule  
})
export class CarsModule {}
