import { Module } from "@nestjs/common";
import { CarsModule } from "./cars/cars.module";
import { ReservationsModule } from "./reservations/reservations.module";

@Module({
  imports: [CarsModule, ReservationsModule],
})
export class AppModule {}
