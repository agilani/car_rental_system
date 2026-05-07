import { ApiProperty } from "@nestjs/swagger";
import { IsInt, Min } from "class-validator";

export class InitFleetDto {
  @ApiProperty({
    example: 5,
    minimum: 0,
    description: "Number of sedan vehicles to add to the fleet",
  })
  @IsInt()
  @Min(0)
  sedanCount: number;

  @ApiProperty({
    example: 3,
    minimum: 0,
    description: "Number of SUV vehicles to add to the fleet",
  })
  @IsInt()
  @Min(0)
  suvCount: number;

  @ApiProperty({
    example: 2,
    minimum: 0,
    description: "Number of van vehicles to add to the fleet",
  })
  @IsInt()
  @Min(0)
  vanCount: number;
}
