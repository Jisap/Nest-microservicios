import { Module } from '@nestjs/common';
import { AxiosAdapter } from './adapters/axios.adapter';

@Module({
  providers: [AxiosAdapter],  // Definimos como provider el AxiosAdapter
  exports: [AxiosAdapter]     // Exportamos el adapter de Axios para que pueda ser inyectado en otros módulos
})
export class CommonModule {}
