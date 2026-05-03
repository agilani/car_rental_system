import { Car } from "./Car";
import { CarType } from "../types/CarType";

export class Reservation {
  private id: string;
  private car: Car;
  private startDate: Date;
  private endDate: Date;
  private numberOfDays: number;
  private totalCost: number;

  constructor(
    id: string,
    car: Car,
    startDate: Date,
    numberOfDays: number,
    pricePerDay: number
  ) {
    this.id = id;
    this.car = car;
    this.startDate = startDate;
    this.numberOfDays = numberOfDays;
    this.endDate = new Date(startDate);
    this.endDate.setDate(this.endDate.getDate() + numberOfDays);
    this.totalCost = numberOfDays * pricePerDay;
  }

  getId(): string {
    return this.id;
  }

  getCar(): Car {
    return this.car;
  }

  getStartDate(): Date {
    return this.startDate;
  }

  getEndDate(): Date {
    return this.endDate;
  }

  getNumberOfDays(): number {
    return this.numberOfDays;
  }

  getTotalCost(): number {
    return this.totalCost;
  }

  getCarType(): CarType {
    return this.car.getType();
  }
}

export default Reservation;
