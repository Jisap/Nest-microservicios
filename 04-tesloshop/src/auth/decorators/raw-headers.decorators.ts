import { createParamDecorator, ExecutionContext, InternalServerErrorException } from "@nestjs/common";



export const RawHeaders = createParamDecorator(      // Creamos un decorador personalizado para obtener los RawHeaders de la solicitud
  
  (data: string, ctx: ExecutionContext) => {         // La función que define el decorador toma dos parametros:
                                                     // data->expecifica que prop de la solicitud queremos obtener y ctx->contiene info sobre la solicitud en si

    const req = ctx.switchToHttp().getRequest();     // Obtenemos la request
    const rawHeaders = req.rawHeaders;               // De la request obtenemos los rawHeaders


    if (!rawHeaders)
      throw new InternalServerErrorException('User not found (request)')


    return rawHeaders
  }
)