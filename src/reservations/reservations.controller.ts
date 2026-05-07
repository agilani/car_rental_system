import { Body, Controller, Delete, Get, Param, Post } from "@nestjs/common";
import {
  ApiBody,
  ApiCreatedResponse,
  ApiOperation,
  ApiOkResponse,
  ApiParam,
  ApiTags,
} from "@nestjs/swagger";
import { CarRentalService } from "../services/car-rental.service";
import { CreateReservationDto } from "./dto/create-reservation.dto";

@ApiTags("Reservations")
@Controller("reservations")
export class ReservationsController {
  constructor(private readonly carRentalService: CarRentalService) {}

  @Post()
  @ApiOperation({ summary: "Create a new reservation" })
  @ApiBody({ type: CreateReservationDto })
  @ApiCreatedResponse({ description: "Reservation created successfully" })
  createReservation(@Body() body: CreateReservationDto) {
    const reservation = this.carRentalService.reserveCar(
      body.carType,
      new Date(body.startDate),
      body.numberOfDays,
    );

    return {
      id: reservation.getId(),
      carId: reservation.getCar().getId(),
      carType: reservation.getCarType(),
      startDate: reservation.getStartDate().toISOString(),
      endDate: reservation.getEndDate().toISOString(),
      numberOfDays: reservation.getNumberOfDays(),
      totalCost: reservation.getTotalCost(),
    };
  }

  @Delete(":id")
  @ApiOperation({ summary: "Cancel an existing reservation" })
  @ApiParam({ name: "id", description: "Reservation ID to cancel" })
  @ApiOkResponse({ description: "Reservation canceled successfully" })
  cancelReservation(@Param("id") id: string) {
    this.carRentalService.cancelReservation(id);
    return {
      success: true,
      reservationId: id,
    };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get reservation details by ID" })
  @ApiParam({ name: "id", description: "Reservation ID" })
  @ApiOkResponse({ description: "Reservation details returned successfully" })
  getReservation(@Param("id") id: string) {
    const reservation = this.carRentalService.getReservation(id);
    return {
      id: reservation.getId(),
      carId: reservation.getCar().getId(),
      carType: reservation.getCarType(),
      startDate: reservation.getStartDate().toISOString(),
      endDate: reservation.getEndDate().toISOString(),
      numberOfDays: reservation.getNumberOfDays(),
      totalCost: reservation.getTotalCost(),
    };
  }

  @Get()
  @ApiOperation({ summary: "List all reservations" })
  @ApiOkResponse({ description: "All reservations returned successfully" })
  getAllReservations() {
    return {
      reservations: this.carRentalService.getAllReservations().map((reservation) => ({
        id: reservation.getId(),
        carId: reservation.getCar().getId(),
        carType: reservation.getCarType(),
        startDate: reservation.getStartDate().toISOString(),
        endDate: reservation.getEndDate().toISOString(),
        numberOfDays: reservation.getNumberOfDays(),
        totalCost: reservation.getTotalCost(),
      })),
    };
  }
}
