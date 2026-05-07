import { Car } from "../../models/Car";
import { CarType } from "../../types/CarType";

export interface ICarsRepository {
  /**
   * Add a car to the repository
   */
  addCar(car: Car): void;

  /**
   * Get a car by ID
   */
  getCarById(id: string): Car | null;

  /**
   * Get all cars
   */
  getAllCars(): Car[];

  /**
   * Get all cars of a specific type
   */
  getCarsByType(type: CarType): Car[];

  /**
   * Get all available cars of a specific type
   */
  getAvailableCarsByType(type: CarType): Car[];

  /**
   * Update car availability
   */
  updateCarAvailability(carId: string, available: boolean): void;

  /**
   * Check if any car matches a condition (for date range conflicts)
   */
  findCarByCondition(predicate: (car: Car) => boolean): Car | null;

  /**
   * Get count of cars by type
   */
  getCarCountByType(type: CarType): number;

  /**
   * Get count of available cars by type
   */
  getAvailableCarCountByType(type: CarType): number;
}
