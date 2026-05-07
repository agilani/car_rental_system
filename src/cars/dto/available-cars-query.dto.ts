import { ApiProperty } from "@nestjs/swagger";
import { IsEnum } from "class-validator";
import { CarType } from "../../types/CarType";

export class AvailableCarsQueryDto {
  @ApiProperty({
    enum: CarType,
    example: CarType.SEDAN,
    description: "Car type to filter available inventory",
  })
  @IsEnum(CarType)
  type: CarType;
}
