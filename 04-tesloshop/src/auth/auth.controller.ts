import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { GetUser, RawHeaders } from './decorators';



@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register') //api/auth/register
  create(@Body() createUserDto: CreateUserDto) {
    return this.authService.create(createUserDto);
  }

  @Post('login')
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.authService.login(loginUserDto);
  }

  @Get('private')
  @UseGuards(AuthGuard())                       // Aquí se usa el validate de JWTStrategy -> jwt -> id del user y comprueba que exista en bd 
  testingPrivateRoute(
    @Req() request: Express.Request,            // La info del token se pasa a la request que será usada por los decoradores siguientes.(no necesario poner)
    @GetUser() user: User,                      // Usamos un decorador personalizado para obtener el usuario desde la request
    @GetUser('email') userEmail: string,        // Ejemplo de uso del decorador para obtener la prop 'email
    @RawHeaders() rawHeaders: string[],         // Ejemplo de uso de un decorador personalizado que obtiene los rawHeaders de la solicitud
  ){

    return {
      ok: true,
      message: 'hola mundo private',
      user,
      userEmail,
      rawHeaders
    }
  }
}
