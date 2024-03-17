import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CarsService } from './cars.service';

@Controller('cars')                   // Escucha las peticiones (a localhost:3000/cars) de los clientes (postman), y emite una respuesta
export class CarsController {

  constructor(
    private readonly carsService:CarsService  
  ){}

  @Get()
  getAllCars(){
    return this.carsService.findAll()
  }

  @Get(':id')
  getCarById( @Param('id', ParseIntPipe) id:number ){  
    return this.carsService.findOneById(id)
  }
}
