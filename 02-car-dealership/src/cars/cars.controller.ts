import { Controller, Get } from '@nestjs/common';

@Controller('cars')                   // Escucha las peticiones (a localhost:3000/cars) de los clientes (postman), y emite una respuesta
export class CarsController {

  @Get()
  getAllCars(){
    return ['Toyota', 'Honda', 'Jeep']
  }
}
