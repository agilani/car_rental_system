import { CarType } from "../types/CarType";

export class Car {
  private id: string;
  private type: CarType;
  private isAvailable: boolean;

  constructor(id: string, type: CarType) {
    this.id = id;
    this.type = type;
    this.isAvailable = true;
  }

  getId(): string {
    return this.id;
  }

  getType(): CarType {
    return this.type;
  }

  isCarAvailable(): boolean {
    return this.isAvailable;
  }

  setAvailability(available: boolean): void {
    this.isAvailable = available;
  }
}

export default Car;
