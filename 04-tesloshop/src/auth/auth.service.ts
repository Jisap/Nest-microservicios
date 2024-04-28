import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';


@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)                                 // El módulo AuthService trabaja con instancias del modelo User
    private readonly userRepository: Repository<User>       // Las instancias son los userRepository basadas en la entity User
  ){}

  async create(createUserDto: CreateUserDto) {

    try {
      
      const user = this.userRepository.create(createUserDto);
      await this.userRepository.save( user );
      return user;

    } catch (error) {
      console.log(error)
    }

    return 'This action adds a new auth';
  }

  
}
