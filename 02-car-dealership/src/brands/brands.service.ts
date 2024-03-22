import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateBrandDto } from './dto/create-brand.dto';
import { UpdateBrandDto } from './dto/update-brand.dto';
import { Brand } from './entities/brand.entity';
import { v4 as uuid } from 'uuid';

@Injectable()
export class BrandsService {

  private brands: Brand[] = [
    {
      id: uuid(),
      name: 'Toyota',
      createdAt: new Date().getTime()
    }
  ]


  create(createBrandDto: CreateBrandDto) {
    
    const { name } = createBrandDto;
    const brand: Brand = {
      id: uuid(),
      name: name.toLocaleLowerCase(),
      createdAt: new Date().getTime()
    }

    this.brands.push( brand );

    return brand
  }

  findAll() {
    return this.brands;
  }

  findOne(id: string) {
    const brand = this.brands.find(brand => brand.id === id);
    if(!brand) throw new NotFoundException(`Brand with id "${id}" not found`);
    return brand;    
  }

  update(id: string, updateBrandDto: UpdateBrandDto) {

    let brandDB = this.findOne(id);                   // Brand en bd

    this.brands = this.brands.map(brand => {          // Mapeo de las brands[]
      if (brand.id === id) {                          // Si el id que mapeamos = al id del argumento
        brandDB.updatedAt = new Date().getTime();     // modificamos updateAt con la nueva fecha
        brandDB = { ...brandDB, ...updateBrandDto };  // esparcimos las props de brandDB y las sustituimos con las del dto
        return brandDB                                // devolvemos la brand actualizada
      }
      return brand
    })
    return brandDB
  }

  remove(id: string) {
    this.brands = this.brands.filter( brand => brand.id !== id );
  }
}
