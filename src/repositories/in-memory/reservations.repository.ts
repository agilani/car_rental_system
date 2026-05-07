import { Injectable } from "@nestjs/common";
import { Reservation } from "../../models/Reservation";
import { IReservationsRepository } from "../interfaces/reservations.repository.interface";

@Injectable()
export class InMemoryReservationsRepository implements IReservationsRepository {
  private reservations: Map<string, Reservation> = new Map();
  private reservationIdCounter: number = 1;

  saveReservation(reservation: Reservation): void {
    this.reservations.set(reservation.getId(), reservation);
  }

  getReservationById(id: string): Reservation | null {
    return this.reservations.get(id) || null;
  }

  getAllReservations(): Reservation[] {
    return Array.from(this.reservations.values());
  }

  deleteReservation(id: string): boolean {
    return this.reservations.delete(id);
  }

  exists(id: string): boolean {
    return this.reservations.has(id);
  }

  findByCondition(predicate: (res: Reservation) => boolean): Reservation[] {
    return Array.from(this.reservations.values()).filter(predicate);
  }

  /**
   * Generate unique reservation IDs (used internally)
   */
  generateReservationId(): string {
    return `RES-${this.reservationIdCounter++}`;
  }

  /**
   * Reset the repository (useful for testing)
   */
  clear(): void {
    this.reservations.clear();
    this.reservationIdCounter = 1;
  }
}
