import { CarRentalSystem } from "../services/CarRentalSystem";
import { CarType } from "../types/CarType";
import { Car } from "../models/Car";
import { Reservation } from "../models/Reservation";

describe("CarRentalSystem", () => {
  let system: CarRentalSystem;

  beforeEach(() => {
    system = new CarRentalSystem();
  });

  describe("Fleet Initialization", () => {
    test("should initialize fleet with correct number of cars", () => {
      system.initializeFleet(5, 3, 2);

      const stats = system.getFleetStats();
      expect(stats.totalCars).toBe(10);
      expect(stats.carsByType[CarType.SEDAN]).toBe(5);
      expect(stats.carsByType[CarType.SUV]).toBe(3);
      expect(stats.carsByType[CarType.VAN]).toBe(2);
    });

    test("should initialize all cars as available", () => {
      system.initializeFleet(2, 2, 2);

      const stats = system.getFleetStats();
      expect(stats.availableCars).toBe(6);
      expect(stats.reservedCars).toBe(0);
    });

    test("should create cars with unique IDs", () => {
      system.initializeFleet(3, 0, 0);

      const cars = system.getAllCars();
      const ids = cars.map((car) => car.getId());
      const uniqueIds = new Set(ids);

      expect(uniqueIds.size).toBe(ids.length);
    });
  });

  describe("Pricing Configuration", () => {
    test("should set and get pricing for each car type", () => {
      system.setPricing(CarType.SEDAN, 60);
      system.setPricing(CarType.SUV, 80);
      system.setPricing(CarType.VAN, 120);

      expect(system.getPricing(CarType.SEDAN)).toBe(60);
      expect(system.getPricing(CarType.SUV)).toBe(80);
      expect(system.getPricing(CarType.VAN)).toBe(120);
    });

    test("should throw error for negative pricing", () => {
      expect(() => system.setPricing(CarType.SEDAN, -10)).toThrow(
        "Price per day cannot be negative"
      );
    });

    test("should have default pricing", () => {
      expect(system.getPricing(CarType.SEDAN)).toBe(50);
      expect(system.getPricing(CarType.SUV)).toBe(75);
      expect(system.getPricing(CarType.VAN)).toBe(100);
    });
  });

  describe("Car Reservation", () => {
    beforeEach(() => {
      system.initializeFleet(3, 2, 1);
    });

    test("should successfully reserve an available car", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const reservation = system.reserveCar(CarType.SEDAN, startDate, 3);

      expect(reservation).toBeDefined();
      expect(reservation.getId()).toMatch(/^RES-/);
      expect(reservation.getCarType()).toBe(CarType.SEDAN);
      expect(reservation.getNumberOfDays()).toBe(3);
    });

    test("should calculate correct number of days in reservation", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const reservation = system.reserveCar(CarType.SEDAN, startDate, 5);

      expect(reservation.getNumberOfDays()).toBe(5);
    });

    test("should calculate correct end date for reservation", () => {
      system.initializeFleet(1, 0, 0);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      const reservation = system.reserveCar(CarType.SEDAN, startDate, 3);

      const expectedEndDate = new Date(startDate);
      expectedEndDate.setDate(expectedEndDate.getDate() + 3);
      expect(reservation.getEndDate()).toEqual(expectedEndDate);
    });

    test("should calculate correct total cost", () => {
      system.setPricing(CarType.SEDAN, 50);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const reservation = system.reserveCar(CarType.SEDAN, startDate, 4);

      expect(reservation.getTotalCost()).toBe(200); // 4 days * 50 per day
    });

    test("should throw error when requesting 0 or negative days", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      expect(() => system.reserveCar(CarType.SEDAN, startDate, 0)).toThrow(
        "Number of days must be greater than 0"
      );

      expect(() => system.reserveCar(CarType.SEDAN, startDate, -1)).toThrow(
        "Number of days must be greater than 0"
      );
    });

    test("should throw error when trying to reserve with past date", () => {
      const pastDate = new Date();
      pastDate.setDate(pastDate.getDate() - 1);

      expect(() => system.reserveCar(CarType.SEDAN, pastDate, 3)).toThrow(
        "Start date cannot be in the past"
      );
    });

    test("should throw error when no cars available for requested type", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      // Reserve all sedans
      system.reserveCar(CarType.SEDAN, startDate, 1);
      system.reserveCar(CarType.SEDAN, startDate, 1);
      system.reserveCar(CarType.SEDAN, startDate, 1);

      // Try to reserve a fourth sedan
      expect(() => system.reserveCar(CarType.SEDAN, startDate, 1)).toThrow(
        /No SEDAN available/
      );
    });

    test("should prevent double-booking of same car", () => {
      const testSystem = new CarRentalSystem();
      testSystem.initializeFleet(1, 0, 0);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const res1 = testSystem.reserveCar(CarType.SEDAN, startDate, 3);

      const overlappingStartDate = new Date(startDate);
      overlappingStartDate.setDate(overlappingStartDate.getDate() + 1);

      expect(() =>
        testSystem.reserveCar(CarType.SEDAN, overlappingStartDate, 3)
      ).toThrow(/No SEDAN available/);
    });

    test("should allow booking same car after previous reservation ends", () => {
      const startDate1 = new Date();
      startDate1.setDate(startDate1.getDate() + 1);

      const res1 = system.reserveCar(CarType.SEDAN, startDate1, 3);

      const startDate2 = new Date(res1.getEndDate());

      const res2 = system.reserveCar(CarType.SEDAN, startDate2, 2);

      expect(res2).toBeDefined();
      expect(res2.getStartDate()).toEqual(startDate2);
    });

    test("should reduce available car count after reservation", () => {
      const rentalSystem = new CarRentalSystem();
      rentalSystem.initializeFleet(3, 0, 0);
      let stats = rentalSystem.getFleetStats();
      expect(stats.availableCarsByType[CarType.SEDAN]).toBe(3);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      rentalSystem.reserveCar(CarType.SEDAN, startDate, 1);

      stats = rentalSystem.getFleetStats();
      expect(stats.availableCarsByType[CarType.SEDAN]).toBe(2);
      expect(stats.reservedCars).toBe(1);
    });
  });

  describe("Reservation Cancellation", () => {
    beforeEach(() => {
      system.initializeFleet(2, 1, 1);
    });

    test("should successfully cancel a reservation", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const reservation = system.reserveCar(CarType.SEDAN, startDate, 2);
      const result = system.cancelReservation(reservation.getId());

      expect(result).toBe(true);
    });

    test("should free up car after cancellation", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const res1 = system.reserveCar(CarType.SEDAN, startDate, 3);

      let stats = system.getFleetStats();
      expect(stats.availableCars).toBe(3); // 2 + 1 + 1 - 1 reserved

      system.cancelReservation(res1.getId());

      stats = system.getFleetStats();
      expect(stats.availableCars).toBe(4);
      expect(stats.reservedCars).toBe(0);
    });

    test("should allow rebooking car after cancellation", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const res1 = system.reserveCar(CarType.SEDAN, startDate, 2);
      system.cancelReservation(res1.getId());

      const res2 = system.reserveCar(CarType.SEDAN, startDate, 1);

      expect(res2).toBeDefined();
    });

    test("should throw error when canceling non-existent reservation", () => {
      expect(() => system.cancelReservation("RES-999")).toThrow(
        "Reservation RES-999 not found"
      );
    });

    test("should throw error when canceling already canceled reservation", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const reservation = system.reserveCar(CarType.SEDAN, startDate, 1);
      system.cancelReservation(reservation.getId());

      expect(() => system.cancelReservation(reservation.getId())).toThrow(
        "Reservation"
      );
    });
  });

  describe("Reservation Retrieval", () => {
    beforeEach(() => {
      system.initializeFleet(2, 1, 1);
    });

    test("should retrieve reservation by ID", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const reservation = system.reserveCar(CarType.SEDAN, startDate, 2);
      const retrieved = system.getReservation(reservation.getId());

      expect(retrieved.getId()).toBe(reservation.getId());
      expect(retrieved.getCarType()).toBe(CarType.SEDAN);
    });

    test("should throw error when retrieving non-existent reservation", () => {
      expect(() => system.getReservation("RES-999")).toThrow(
        "Reservation RES-999 not found"
      );
    });

    test("should get all reservations", () => {
      const startDate1 = new Date();
      startDate1.setDate(startDate1.getDate() + 1);

      const startDate2 = new Date();
      startDate2.setDate(startDate2.getDate() + 5);

      const res1 = system.reserveCar(CarType.SEDAN, startDate1, 2);
      const res2 = system.reserveCar(CarType.SUV, startDate2, 1);

      const allReservations = system.getAllReservations();

      expect(allReservations.length).toBe(2);
      expect(allReservations).toContainEqual(res1);
      expect(allReservations).toContainEqual(res2);
    });
  });

  describe("Available Cars Query", () => {
    beforeEach(() => {
      system.initializeFleet(3, 2, 1);
    });

    test("should get all available cars of a type", () => {
      const available = system.getAvailableCars(CarType.SEDAN);

      expect(available.length).toBe(3);
      available.forEach((car) => {
        expect(car.getType()).toBe(CarType.SEDAN);
        expect(car.isCarAvailable()).toBe(true);
      });
    });

    test("should exclude reserved cars from available list", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      system.reserveCar(CarType.SEDAN, startDate, 2);

      const available = system.getAvailableCars(CarType.SEDAN);

      expect(available.length).toBe(2);
    });

    test("should return empty array when no cars available of requested type", () => {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      // Reserve all sedans
      system.reserveCar(CarType.SEDAN, startDate, 1);
      system.reserveCar(CarType.SEDAN, startDate, 1);
      system.reserveCar(CarType.SEDAN, startDate, 1);

      const available = system.getAvailableCars(CarType.SEDAN);

      expect(available.length).toBe(0);
    });
  });

  describe("Fleet Statistics", () => {
    test("should provide accurate fleet statistics", () => {
      system.initializeFleet(5, 3, 2);

      const stats = system.getFleetStats();

      expect(stats.totalCars).toBe(10);
      expect(stats.availableCars).toBe(10);
      expect(stats.reservedCars).toBe(0);
      expect(stats.carsByType[CarType.SEDAN]).toBe(5);
      expect(stats.carsByType[CarType.SUV]).toBe(3);
      expect(stats.carsByType[CarType.VAN]).toBe(2);
      expect(stats.availableCarsByType[CarType.SEDAN]).toBe(5);
      expect(stats.availableCarsByType[CarType.SUV]).toBe(3);
      expect(stats.availableCarsByType[CarType.VAN]).toBe(2);
    });

    test("should update statistics after reservation", () => {
      system.initializeFleet(2, 1, 1);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      system.reserveCar(CarType.SEDAN, startDate, 1);

      const stats = system.getFleetStats();

      expect(stats.availableCars).toBe(3);
      expect(stats.reservedCars).toBe(1);
      expect(stats.availableCarsByType[CarType.SEDAN]).toBe(1);
    });

    test("should update statistics after cancellation", () => {
      system.initializeFleet(1, 1, 1);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const res = system.reserveCar(CarType.SUV, startDate, 1);
      let stats = system.getFleetStats();

      expect(stats.availableCars).toBe(2);
      expect(stats.reservedCars).toBe(1);

      system.cancelReservation(res.getId());

      stats = system.getFleetStats();

      expect(stats.availableCars).toBe(3);
      expect(stats.reservedCars).toBe(0);
    });
  });

  describe("Car Model", () => {
    test("should create a car with correct properties", () => {
      const car = new Car("CAR-001", CarType.SEDAN);

      expect(car.getId()).toBe("CAR-001");
      expect(car.getType()).toBe(CarType.SEDAN);
      expect(car.isCarAvailable()).toBe(true);
    });

    test("should allow setting car availability", () => {
      const car = new Car("CAR-002", CarType.SUV);

      expect(car.isCarAvailable()).toBe(true);

      car.setAvailability(false);
      expect(car.isCarAvailable()).toBe(false);

      car.setAvailability(true);
      expect(car.isCarAvailable()).toBe(true);
    });
  });

  describe("Reservation Model", () => {
    test("should create a reservation with correct properties", () => {
      const car = new Car("CAR-001", CarType.SEDAN);
      const startDate = new Date("2025-05-10");
      const reservation = new Reservation(
        "RES-001",
        car,
        startDate,
        3,
        50
      );

      expect(reservation.getId()).toBe("RES-001");
      expect(reservation.getCar()).toBe(car);
      expect(reservation.getStartDate()).toEqual(startDate);
      expect(reservation.getNumberOfDays()).toBe(3);
      expect(reservation.getCarType()).toBe(CarType.SEDAN);
    });

    test("should calculate end date correctly", () => {
      const car = new Car("CAR-001", CarType.VAN);
      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);
      const reservation = new Reservation(
        "RES-001",
        car,
        startDate,
        5,
        100
      );

      const expectedEndDate = new Date(startDate);
      expectedEndDate.setDate(expectedEndDate.getDate() + 5);
      expect(reservation.getEndDate()).toEqual(expectedEndDate);
    });

    test("should calculate total cost correctly", () => {
      const car = new Car("CAR-001", CarType.SUV);
      const startDate = new Date("2025-05-10");
      const reservation = new Reservation(
        "RES-001",
        car,
        startDate,
        7,
        75
      );

      expect(reservation.getTotalCost()).toBe(525); // 7 * 75
    });
  });

  describe("Complex Scenarios", () => {
    test("should handle multiple simultaneous reservations", () => {
      system.initializeFleet(2, 2, 1);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const res1 = system.reserveCar(CarType.SEDAN, startDate, 2);
      const res2 = system.reserveCar(CarType.SEDAN, startDate, 2);
      const res3 = system.reserveCar(CarType.SUV, startDate, 1);
      const res4 = system.reserveCar(CarType.SUV, startDate, 1);

      const allReservations = system.getAllReservations();
      expect(allReservations.length).toBe(4);

      const stats = system.getFleetStats();
      expect(stats.availableCars).toBe(1);
      expect(stats.reservedCars).toBe(4);
    });

    test("should handle staggered bookings on same car", () => {
      system.initializeFleet(1, 0, 0);

      const date1 = new Date();
      date1.setDate(date1.getDate() + 1);

      const res1 = system.reserveCar(CarType.SEDAN, date1, 2);
      system.cancelReservation(res1.getId());

      const date2 = new Date();
      date2.setDate(date2.getDate() + 5);

      const res2 = system.reserveCar(CarType.SEDAN, date2, 1);

      expect(res2).toBeDefined();
      expect(system.getAllReservations().length).toBe(1);
    });

    test("should support different pricing for different car types", () => {
      system.initializeFleet(1, 1, 1);
      system.setPricing(CarType.SEDAN, 40);
      system.setPricing(CarType.SUV, 80);
      system.setPricing(CarType.VAN, 120);

      const startDate = new Date();
      startDate.setDate(startDate.getDate() + 1);

      const sedan = system.reserveCar(CarType.SEDAN, startDate, 3);
      const suv = system.reserveCar(CarType.SUV, startDate, 3);
      const van = system.reserveCar(CarType.VAN, startDate, 3);

      expect(sedan.getTotalCost()).toBe(120); // 3 * 40
      expect(suv.getTotalCost()).toBe(240); // 3 * 80
      expect(van.getTotalCost()).toBe(360); // 3 * 120
    });
  });
});
