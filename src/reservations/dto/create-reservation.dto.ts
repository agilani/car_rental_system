import { ApiProperty } from "@nestjs/swagger";
import { IsEnum, IsDateString, IsInt, Min } from "class-validator";
import { CarType } from "../../types/CarType";

export class CreateReservationDto {
  @ApiProperty({ enum: CarType, example: CarType.SEDAN, description: "Type of car to reserve" })
  @IsEnum(CarType)
  carType: CarType;

  @ApiProperty({
    type: String,
    format: "date-time",
    example: new Date().toISOString(),
    description: "Start date for the reservation",
  })
  @IsDateString()
  startDate: string;

  @ApiProperty({ example: 3, minimum: 1, description: "Number of rental days" })
  @IsInt()
  @Min(1)
  numberOfDays: number;
}
