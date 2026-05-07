import { Module } from "@nestjs/common";
import { CarRentalService } from "../services/car-rental.service";
import { CarsController } from "./cars.controller";
import { InMemoryCarsRepository } from "../repositories/in-memory/cars.repository";
import { InMemoryReservationsRepository } from "../repositories/in-memory/reservations.repository";

@Module({
  controllers: [CarsController],
  providers: [
    CarRentalService,
    {
      provide: "CarsRepository",
      useClass: InMemoryCarsRepository,
    },
    {
      provide: "ReservationsRepository",
      useClass: InMemoryReservationsRepository,
    },
  ],
  exports: [CarRentalService],
})
export class CarsModule {}
