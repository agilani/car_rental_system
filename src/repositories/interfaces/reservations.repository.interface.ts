import { Reservation } from "../../models/Reservation";

export interface IReservationsRepository {
  /**
   * Save a new reservation
   */
  saveReservation(reservation: Reservation): void;

  /**
   * Get a reservation by ID
   */
  getReservationById(id: string): Reservation | null;

  /**
   * Get all reservations
   */
  getAllReservations(): Reservation[];

  /**
   * Delete a reservation by ID
   */
  deleteReservation(id: string): boolean;

  /**
   * Check if a reservation exists
   */
  exists(id: string): boolean;

  /**
   * Find reservations by a condition
   */
  findByCondition(predicate: (res: Reservation) => boolean): Reservation[];
}
