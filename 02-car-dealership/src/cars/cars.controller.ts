import { Body, Controller, Delete, Get, Param, ParseIntPipe, ParseUUIDPipe, Patch, Post, UsePipes, ValidationPipe } from '@nestjs/common';
import { CarsService } from './cars.service';
import { CreateCarDto, UpdateCarDto } from './dto';


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
  getCarById( @Param('id', new ParseUUIDPipe({version: '4'}) ) id:string ){  
    return this.carsService.findOneById(id)
  }

  @Post()
  createCar(@Body() createCarDto:CreateCarDto){
    return this.carsService.create(createCarDto)
  }

  @Patch(':id')
  updateCar(
    @Param('id', ParseUUIDPipe) id:string,
    @Body() updateCarDto: UpdateCarDto) {
    return this.carsService.update(id, updateCarDto);
    }

  @Delete(':id')
  deleteCar(@Param('id', ParseUUIDPipe) id: string) {
    return this.carsService.delete(id)
  }

}
