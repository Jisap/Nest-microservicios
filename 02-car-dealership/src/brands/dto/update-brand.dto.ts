// import { PartialType } from '@nestjs/mapped-types'; // Permite extender un dto basado en otro dto
// import { CreateBrandDto } from './create-brand.dto';

import { IsString, MinLength } from "class-validator";

// export class UpdateBrandDto extends PartialType(CreateBrandDto) { // PartialType permite que las props del dto de donde se extiende seán opcionales

// }

export class UpdateBrandDto {
 
  @IsString()
  @MinLength(1)
  name: string;
}
