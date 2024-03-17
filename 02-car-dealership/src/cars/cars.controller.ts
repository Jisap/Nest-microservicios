import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post } from '@nestjs/common';
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

  @Post()
  createCar(@Body() body:any){
    return body
  }

  @Patch(':id')
  updateCar(@Body() body: any) {
    return body
  }

  @Delete(':id')
  deleteCar(@Param('id', ParseIntPipe) id:number){
    return {
      method: 'delete',
      id
    }
  }

}
