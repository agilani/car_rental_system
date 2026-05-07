import { Module } from "@nestjs/common";
import { CarsModule } from "../cars/cars.module";
import { ReservationsController } from "./reservations.controller";

@Module({
  imports: [CarsModule],
  controllers: [ReservationsController],
})
export class ReservationsModule {}
