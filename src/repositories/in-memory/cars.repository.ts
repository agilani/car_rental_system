import { Injectable } from "@nestjs/common";
import { Car } from "../../models/Car";
import { CarType } from "../../types/CarType";
import { ICarsRepository } from "../interfaces/cars.repository.interface";

@Injectable()
export class InMemoryCarsRepository implements ICarsRepository {
  private cars: Map<string, Car> = new Map();
  private carIdCounter: number = 1;

  addCar(car: Car): void {
    this.cars.set(car.getId(), car);
  }

  getCarById(id: string): Car | null {
    return this.cars.get(id) || null;
  }

  getAllCars(): Car[] {
    return Array.from(this.cars.values());
  }

  getCarsByType(type: CarType): Car[] {
    return Array.from(this.cars.values()).filter((car) => car.getType() === type);
  }

  getAvailableCarsByType(type: CarType): Car[] {
    return Array.from(this.cars.values()).filter(
      (car) => car.getType() === type && car.isCarAvailable(),
    );
  }

  updateCarAvailability(carId: string, available: boolean): void {
    const car = this.cars.get(carId);
    if (car) {
      car.setAvailability(available);
    }
  }

  findCarByCondition(predicate: (car: Car) => boolean): Car | null {
    for (const car of this.cars.values()) {
      if (predicate(car)) {
        return car;
      }
    }
    return null;
  }

  getCarCountByType(type: CarType): number {
    return this.getCarsByType(type).length;
  }

  getAvailableCarCountByType(type: CarType): number {
    return this.getAvailableCarsByType(type).length;
  }

  /**
   * Add multiple cars (used for fleet initialization)
   */
  addCars(carsToAdd: Car[]): void {
    carsToAdd.forEach((car) => this.addCar(car));
  }

  /**
   * Generate unique car IDs (used internally)
   */
  generateCarId(): string {
    return `CAR-${this.carIdCounter++}`;
  }

  /**
   * Reset the repository (useful for testing)
   */
  clear(): void {
    this.cars.clear();
    this.carIdCounter = 1;
  }
}
