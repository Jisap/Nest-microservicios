import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const GetUser = createParamDecorator(         // createParamDecorator define un nuevo decorador llamado Getuser para obtener info del usuario de la solicitud http
  (data: string, ctx: ExecutionContext) => {         // La función que define el decorador toma dos parametros: 
                                                     // data->expecifica que prop del usuario queremos obtener y ctx->contiene info sobre la solicitud

    const req = ctx.switchToHttp().getRequest();     // Obtenemos el objeto de la solicitud http, req.
    const user = req.user;                           // De la request obtenemos el usuario
    const email = req.email;                         // y el email

    if (!user)
      throw new InternalServerErrorException('User not found (request)')

    return (!data) ? user : user[data]; // Si el decorador no tiene ningún parámetro devolvemos el usuario
    // Pero si si lo tiene devolvemos la prop de usuario correspondiente a ese parámetro          

  }
)