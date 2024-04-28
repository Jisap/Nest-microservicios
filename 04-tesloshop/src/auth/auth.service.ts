import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {

  constructor(
    @InjectRepository(User)                                 // El módulo AuthService trabaja con instancias del modelo User
    private readonly userRepository: Repository<User>       // Las instancias son los userRepository basadas en la entity User
  ){}

  async create(createUserDto: CreateUserDto) {

    try {
      const { password, ...userData } = createUserDto;          // Extraemos del dto la password
      const user = this.userRepository.create({
        ...userData,                                            // El dto se compondrá de los datos del usuario
        password: bcrypt.hashSync(password, 10)
      });
      await this.userRepository.save( user );
      delete user.password;
      return {
        ...user
      }

    } catch (error) {
      this.handleDBErrors(error)
    }
  }

  private handleDBErrors(error: any): never {

    if (error.code === '23505')
      throw new BadRequestException(error.detail)

    console.log(error)

    throw new InternalServerErrorException('PLease check server logs')
  }
}
