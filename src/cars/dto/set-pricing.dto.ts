import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsNumber, Min } from "class-validator";
import { CarType } from "../../types/CarType";
import { Type } from "class-transformer";

export class SetPricingDto {
  @ApiProperty({
    enum: CarType,
    example: CarType.SEDAN,
    description: "The type of car to update pricing for",
  })
  @IsEnum(CarType)
  carType: CarType;

  @ApiProperty({
    example: 50,
    minimum: 0,
    description: "Daily rental rate for the selected car type",
  })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  pricePerDay: number;
}
