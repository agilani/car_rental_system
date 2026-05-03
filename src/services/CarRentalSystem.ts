import { Car } from "../models/Car";
import { Reservation } from "../models/Reservation";
import { CarType } from "../types/CarType";

interface PricingConfig {
  [CarType.SEDAN]: number;
  [CarType.SUV]: number;
  [CarType.VAN]: number;
}

export class CarRentalSystem {
  private cars: Map<string, Car>;
  private reservations: Map<string, Reservation>;
  private pricingConfig: PricingConfig;
  private reservationIdCounter: number;
  private carIdCounter: number;

  constructor() {
    this.cars = new Map();
    this.reservations = new Map();
    this.reservationIdCounter = 1;
    this.carIdCounter = 1;

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
    this.addCarsToFleet(CarType.SEDAN, sedanCount);
    this.addCarsToFleet(CarType.SUV, suvCount);
    this.addCarsToFleet(CarType.VAN, vanCount);
  }

  /**
   * Add cars of a specific type to the fleet
   */
  private addCarsToFleet(type: CarType, count: number): void {
    for (let i = 0; i < count; i++) {
      const carId = `CAR-${this.carIdCounter++}`;
      this.cars.set(carId, new Car(carId, type));
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
  private isCarAvailableDuringPeriod(
    car: Car,
    startDate: Date,
    endDate: Date
  ): boolean {
    if (!car.isCarAvailable()) {
      return false;
    }

    // Check if the car has any conflicting reservations
    for (const reservation of this.reservations.values()) {
      if (reservation.getCar().getId() === car.getId()) {
        const resStart = reservation.getStartDate();
        const resEnd = reservation.getEndDate();

        // Check for overlapping dates
        if (startDate < resEnd && endDate > resStart) {
          return false;
        }
      }
    }

    return true;
  }

  /**
   * Find an available car of the given type for the specified dates
   */
  private findAvailableCar(
    carType: CarType,
    startDate: Date,
    endDate: Date
  ): Car | null {
    for (const car of this.cars.values()) {
      if (
        car.getType() === carType &&
        this.isCarAvailableDuringPeriod(car, startDate, endDate)
      ) {
        return car;
      }
    }
    return null;
  }

  /**
   * Reserve a car of the given type for the specified period
   */
  reserveCar(
    carType: CarType,
    startDate: Date,
    numberOfDays: number
  ): Reservation {
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
        `No ${carType} available for the requested dates (${startDate.toDateString()} to ${endDate.toDateString()})`
      );
    }

    const reservationId = `RES-${this.reservationIdCounter++}`;
    const pricePerDay = this.getPricing(carType);
    const reservation = new Reservation(
      reservationId,
      availableCar,
      startDate,
      numberOfDays,
      pricePerDay
    );

    this.reservations.set(reservationId, reservation);
    availableCar.setAvailability(false);

    return reservation;
  }

  /**
   * Cancel a reservation and free up the car
   */
  cancelReservation(reservationId: string): boolean {
    const reservation = this.reservations.get(reservationId);

    if (!reservation) {
      throw new Error(`Reservation ${reservationId} not found`);
    }

    reservation.getCar().setAvailability(true);
    this.reservations.delete(reservationId);

    return true;
  }

  /**
   * Get a reservation by ID
   */
  getReservation(reservationId: string): Reservation {
    const reservation = this.reservations.get(reservationId);

    if (!reservation) {
      throw new Error(`Reservation ${reservationId} not found`);
    }

    return reservation;
  }

  /**
   * Get all current reservations
   */
  getAllReservations(): Reservation[] {
    return Array.from(this.reservations.values());
  }

  /**
   * Get all cars
   */
  getAllCars(): Car[] {
    return Array.from(this.cars.values());
  }

  /**
   * Get available cars of a specific type
   */
  getAvailableCars(carType: CarType): Car[] {
    return Array.from(this.cars.values()).filter(
      (car) => car.getType() === carType && car.isCarAvailable()
    );
  }

  /**
   * Get fleet statistics
   */
  getFleetStats(): {
    totalCars: number;
    availableCars: number;
    reservedCars: number;
    carsByType: { [key in CarType]: number };
    availableCarsByType: { [key in CarType]: number };
  } {
    const stats = {
      totalCars: this.cars.size,
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

    for (const car of this.cars.values()) {
      const type = car.getType();
      stats.carsByType[type]++;

      if (car.isCarAvailable()) {
        stats.availableCars++;
        stats.availableCarsByType[type]++;
      } else {
        stats.reservedCars++;
      }
    }

    return stats;
  }
}

export default CarRentalSystem;
