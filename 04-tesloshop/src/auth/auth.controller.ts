import { ApiTags } from '@nestjs/swagger';
import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Headers, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { CreateUserDto, LoginUserDto } from './dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from './entities/user.entity';
import { Auth, GetUser, RawHeaders } from './decorators';
import { IncomingHttpHeaders } from 'http';
import { UserRoleGuard } from './guards/user-role/user-role.guard';
import { RoleProtected } from './decorators/role-protected.decorator';
import { ValidRoles } from './interface/valid-roles';



@ApiTags('Auth')
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

  @Get('check-status')                                         // Ruta para renovar la validez/duración del token 
  @Auth()                                                      // 1º Validamos el token contra el usuario de la bd
  checkAuthStatus(                                             // 2º Renovamos validez del token con esta función que llama a un servicio 
    @GetUser() user: User                                      // Este servicio necesitará el usuario del token contenido en la petición ( request )
  ) {
    return this.authService.checkAuthStatus(user)            // Se lo enviamos al servicio
  }

  @Get('private')
  @UseGuards(AuthGuard())                       // Aquí se usa el validate de JWTStrategy -> jwt -> id del user y comprueba que exista en bd 
  testingPrivateRoute(
    @Req() request: Express.Request,            // La info del token se pasa a la request que será usada por los decoradores siguientes.(no necesario poner)
    @GetUser() user: User,                      // Usamos un decorador personalizado para obtener el usuario desde la request
    @GetUser('email') userEmail: string,        // Ejemplo de uso del decorador para obtener la prop 'email
    @RawHeaders() rawHeaders: string[],         // Ejemplo de uso de un decorador personalizado que obtiene los rawHeaders de la solicitud
    @Headers() headers: IncomingHttpHeaders,    // Ejemplo de uso de decorador propio de Nest que hace lo mismo que el anterior
  ){

    return {
      ok: true,
      message: 'hola mundo private',
      user,
      userEmail,
      rawHeaders,
      headers
    }
  }

  @Get('private2')
  //@SetMetadata('roles', ['admin', 'super-user'])            // Establecemos en la metadata los roles válidos para esta ruta (poco recomendable)
  @RoleProtected(ValidRoles.superUser, ValidRoles.admin)      // Usamos en cambio un decorador personalizado que los establece atraves de una constante
  @UseGuards(AuthGuard(), UserRoleGuard)                      // El resto igual: validate de JWTStrategy + comprobación del rol que tiene el user
  privateRoute2(
    @GetUser() user:User
  ){
    return {
      ok: true,
      user,
    }
  }


  @Get('private3')
  @Auth(ValidRoles.admin)
  privateRoute3(
    @GetUser() user: User
  ) {
    return {
      ok: true,
      user,
    }
  }
}
