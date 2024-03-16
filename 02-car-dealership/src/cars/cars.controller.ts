import { Controller, Get, Param } from '@nestjs/common';

@Controller('cars')                   // Escucha las peticiones (a localhost:3000/cars) de los clientes (postman), y emite una respuesta
export class CarsController {

  private cars = ['Toyota', 'Honda', 'Jeep']

  @Get()
  getAllCars(){
    return this.cars
  }

  @Get(':id')
  getCarById( @Param('id') id:string ){
    console.log({id})
    const car = this.cars[id]
    return {
      id,
      car
    }
  }
}
