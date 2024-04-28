import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
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
      this.handleDBErrors(error)
    }

    return 'This action adds a new auth';
  }

  private handleDBErrors(error: any): never {

    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    console.log(error)

    throw new InternalServerErrorException('PLease check server logs')
  }
}
