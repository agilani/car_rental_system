import { Injectable, Inject } from "@nestjs/common";
import { Car } from "../models/Car";
import { Reservation } from "../models/Reservation";
import { CarType } from "../types/CarType";
import { ICarsRepository } from "../repositories/interfaces/cars.repository.interface";
import { IReservationsRepository } from "../repositories/interfaces/reservations.repository.interface";

@Injectable()
export class CarRentalService {
  private pricingConfig: { [key in CarType]: number };

  constructor(
    @Inject("CarsRepository")
    private readonly carsRepository: ICarsRepository,
    @Inject("ReservationsRepository")
    private readonly reservationsRepository: IReservationsRepository,
  ) {
    // Default pricing per day
    this.pricingConfig = {
      [CarType.SEDAN]: 50,
      [CarType.SUV]: 75,
      [CarType.VAN]: 100,
    };
  }

  /**
   * Initialize the car fleet with specific quantities of each car type
   */
  initializeFleet(sedanCount: number, suvCount: number, vanCount: number): void {
    // Get the repository to access ID generation
    const carsRepo = this.carsRepository as any;

    // Add sedans
    for (let i = 0; i < sedanCount; i++) {
      const carId = carsRepo.generateCarId?.() || `CAR-${i}`;
      const car = new Car(carId, CarType.SEDAN);
      this.carsRepository.addCar(car);
    }

    // Add SUVs
    for (let i = 0; i < suvCount; i++) {
      const carId = carsRepo.generateCarId?.() || `CAR-${i}`;
      const car = new Car(carId, CarType.SUV);
      this.carsRepository.addCar(car);
    }

    // Add vans
    for (let i = 0; i < vanCount; i++) {
      const carId = carsRepo.generateCarId?.() || `CAR-${i}`;
      const car = new Car(carId, CarType.VAN);
      this.carsRepository.addCar(car);
    }
  }

  /**
   * Set pricing for a car type
   */
  setPricing(carType: CarType, pricePerDay: number): void {
    if (pricePerDay < 0) {
      throw new Error("Price per day cannot be negative");
    }
    this.pricingConfig[carType] = pricePerDay;
  }

  /**
   * Get pricing for a car type
   */
  getPricing(carType: CarType): number {
    return this.pricingConfig[carType];
  }

  /**
   * Check if a car is available for the given date range
   */
  private isCarAvailableDuringPeriod(car: Car, startDate: Date, endDate: Date): boolean {
    if (!car.isCarAvailable()) {
      return false;
    }

    // Check if the car has any conflicting reservations
    const conflictingReservations = this.reservationsRepository.findByCondition((reservation) => {
      if (reservation.getCar().getId() === car.getId()) {
        const resStart = reservation.getStartDate();
        const resEnd = reservation.getEndDate();

        // Check for overlapping dates
        if (startDate < resEnd && endDate > resStart) {
          return true;
        }
      }
      return false;
    });

    return conflictingReservations.length === 0;
  }

  /**
   * Find an available car of the given type for the specified dates
   */
  private findAvailableCar(carType: CarType, startDate: Date, endDate: Date): Car | null {
    const availableCars = this.carsRepository.getCarsByType(carType);
    for (const car of availableCars) {
      if (this.isCarAvailableDuringPeriod(car, startDate, endDate)) {
        return car;
      }
    }
    return null;
  }

  /**
   * Reserve a car of the given type for the specified period
   */
  reserveCar(carType: CarType, startDate: Date, numberOfDays: number): Reservation {
    if (numberOfDays <= 0) {
      throw new Error("Number of days must be greater than 0");
    }

    if (startDate < new Date()) {
      throw new Error("Start date cannot be in the past");
    }

    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + numberOfDays);

    const availableCar = this.findAvailableCar(carType, startDate, endDate);

    if (!availableCar) {
      throw new Error(
        `No ${carType} available for the requested dates (${startDate.toDateString()} to ${endDate.toDateString()})`,
      );
    }

    const reservationId = (this.reservationsRepository as any).generateReservationId?.() || "RES-1";
    const pricePerDay = this.getPricing(carType);
    const reservation = new Reservation(
      reservationId,
      availableCar,
      startDate,
      numberOfDays,
      pricePerDay,
    );

    this.reservationsRepository.saveReservation(reservation);
    this.carsRepository.updateCarAvailability(availableCar.getId(), false);

    return reservation;
  }

  /**
   * Cancel a reservation and free up the car
   */
  cancelReservation(reservationId: string): boolean {
    const reservation = this.reservationsRepository.getReservationById(reservationId);

    if (!reservation) {
      throw new Error(`Reservation ${reservationId} not found`);
    }

    reservation.getCar().setAvailability(true);
    this.reservationsRepository.deleteReservation(reservationId);

    return true;
  }

  /**
   * Get a reservation by ID
   */
  getReservation(reservationId: string): Reservation {
    const reservation = this.reservationsRepository.getReservationById(reservationId);

    if (!reservation) {
      throw new Error(`Reservation ${reservationId} not found`);
    }

    return reservation;
  }

  /**
   * Get all current reservations
   */
  getAllReservations(): Reservation[] {
    return this.reservationsRepository.getAllReservations();
  }

  /**
   * Get all cars
   */
  getAllCars(): Car[] {
    return this.carsRepository.getAllCars();
  }

  /**
   * Get available cars of a specific type
   */
  getAvailableCars(carType: CarType): Car[] {
    return this.carsRepository.getAvailableCarsByType(carType);
  }

  /**
   * Get fleet statistics
   */
  getFleetStats() {
    const stats = {
      totalCars: this.carsRepository.getAllCars().length,
      availableCars: 0,
      reservedCars: 0,
      carsByType: {
        [CarType.SEDAN]: 0,
        [CarType.SUV]: 0,
        [CarType.VAN]: 0,
      },
      availableCarsByType: {
        [CarType.SEDAN]: 0,
        [CarType.SUV]: 0,
        [CarType.VAN]: 0,
      },
    };

    for (const carType of Object.values(CarType)) {
      const allCarsOfType = this.carsRepository.getCarsByType(carType);
      const availableCarsOfType = this.carsRepository.getAvailableCarsByType(carType);

      stats.carsByType[carType] = allCarsOfType.length;
      stats.availableCarsByType[carType] = availableCarsOfType.length;
      stats.availableCars += availableCarsOfType.length;
    }

    stats.reservedCars = stats.totalCars - stats.availableCars;

    return stats;
  }
}
