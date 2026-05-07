import { CarRentalSystem } from "./services/CarRentalSystem";
import { CarType } from "./types/CarType";

function printSection(title: string): void {
  console.log("\n" + "=".repeat(70));
  console.log(`  ${title}`);
  console.log("=".repeat(70) + "\n");
}

function printSubsection(title: string): void {
  console.log(`\n--- ${title} ---\n`);
}

function printStats(system: CarRentalSystem): void {
  const stats = system.getFleetStats();
  console.log("📊 Fleet Statistics:");
  console.log(`   Total Cars: ${stats.totalCars}`);
  console.log(`   Available: ${stats.availableCars}`);
  console.log(`   Reserved: ${stats.reservedCars}`);
  console.log(
    `   Sedans: ${stats.availableCarsByType[CarType.SEDAN]}/${stats.carsByType[CarType.SEDAN]} available`,
  );
  console.log(
    `   SUVs: ${stats.availableCarsByType[CarType.SUV]}/${stats.carsByType[CarType.SUV]} available`,
  );
  console.log(
    `   Vans: ${stats.availableCarsByType[CarType.VAN]}/${stats.carsByType[CarType.VAN]} available`,
  );
}

function runCarRentalDemo(): void {
  printSection("🚗 CAR RENTAL SYSTEM DEMONSTRATION");

  // Initialize system
  console.log("Initializing car rental system...\n");
  const system = new CarRentalSystem();

  // Setup fleet
  printSubsection("1. Setting up the Fleet");
  console.log("Adding 5 Sedans, 3 SUVs, and 2 Vans to the fleet...");
  system.initializeFleet(5, 3, 2);
  printStats(system);

  // Price configuration
  printSubsection("2. Configuring Pricing");
  console.log("Setting pricing for each car type:");
  system.setPricing(CarType.SEDAN, 50);
  system.setPricing(CarType.SUV, 75);
  system.setPricing(CarType.VAN, 100);
  console.log(`✓ Sedan: $${system.getPricing(CarType.SEDAN)}/day`);
  console.log(`✓ SUV: $${system.getPricing(CarType.SUV)}/day`);
  console.log(`✓ Van: $${system.getPricing(CarType.VAN)}/day`);

  // Making reservations
  printSubsection("3. Making Reservations");

  // Reservation 1: Sedan for 3 days
  console.log("📅 Reservation 1: Booking a Sedan for 3 days");
  const startDate1 = new Date();
  startDate1.setDate(startDate1.getDate() + 1);

  const reservation1 = system.reserveCar(CarType.SEDAN, startDate1, 3);
  console.log(`✓ Reservation ID: ${reservation1.getId()}`);
  console.log(`  Car Type: ${reservation1.getCarType()}`);
  console.log(`  Start Date: ${reservation1.getStartDate().toDateString()}`);
  console.log(`  End Date: ${reservation1.getEndDate().toDateString()}`);
  console.log(`  Duration: ${reservation1.getNumberOfDays()} days`);
  console.log(`  Total Cost: $${reservation1.getTotalCost()}`);

  // Reservation 2: SUV for 2 days
  console.log("\n📅 Reservation 2: Booking an SUV for 2 days");
  const startDate2 = new Date();
  startDate2.setDate(startDate2.getDate() + 2);

  const reservation2 = system.reserveCar(CarType.SUV, startDate2, 2);
  console.log(`✓ Reservation ID: ${reservation2.getId()}`);
  console.log(`  Car Type: ${reservation2.getCarType()}`);
  console.log(`  Duration: ${reservation2.getNumberOfDays()} days`);
  console.log(`  Total Cost: $${reservation2.getTotalCost()}`);

  // Reservation 3: Van for 5 days
  console.log("\n📅 Reservation 3: Booking a Van for 5 days");
  const startDate3 = new Date();
  startDate3.setDate(startDate3.getDate() + 1);

  const reservation3 = system.reserveCar(CarType.VAN, startDate3, 5);
  console.log(`✓ Reservation ID: ${reservation3.getId()}`);
  console.log(`  Car Type: ${reservation3.getCarType()}`);
  console.log(`  Duration: ${reservation3.getNumberOfDays()} days`);
  console.log(`  Total Cost: $${reservation3.getTotalCost()}`);

  printStats(system);

  // Multiple reservations
  printSubsection("4. Multiple Simultaneous Reservations");
  console.log("Booking multiple cars of the same type...");

  const startDate4 = new Date();
  startDate4.setDate(startDate4.getDate() + 3);

  const reservation4 = system.reserveCar(CarType.SEDAN, startDate4, 2);
  const reservation5 = system.reserveCar(CarType.SEDAN, startDate4, 2);

  console.log(`✓ Sedan reservation 4 (ID: ${reservation4.getId()})`);
  console.log(`✓ Sedan reservation 5 (ID: ${reservation5.getId()})`);

  printStats(system);

  // Check available cars
  printSubsection("5. Checking Available Inventory");
  const availableSedans = system.getAvailableCars(CarType.SEDAN);
  const availableSUVs = system.getAvailableCars(CarType.SUV);
  const availableVans = system.getAvailableCars(CarType.VAN);

  console.log(`Available Sedans: ${availableSedans.length}`);
  console.log(`Available SUVs: ${availableSUVs.length}`);
  console.log(`Available Vans: ${availableVans.length}`);

  // Try to book all remaining sedans
  console.log("\n📅 Booking the last available Sedan...");
  const lastSedanStart = new Date();
  lastSedanStart.setDate(lastSedanStart.getDate() + 5);

  const reservation6 = system.reserveCar(CarType.SEDAN, lastSedanStart, 1);
  console.log(`✓ Successfully booked (ID: ${reservation6.getId()})`);

  printStats(system);

  // Try to book when no sedans available
  console.log("\n📅 Attempting to book another Sedan on the same date...");
  try {
    system.reserveCar(CarType.SEDAN, lastSedanStart, 1);
  } catch (error) {
    console.log(`✗ Error: ${(error as Error).message}`);
  }

  // Viewing all reservations
  printSubsection("6. Viewing All Active Reservations");
  const allReservations = system.getAllReservations();
  console.log(`Total active reservations: ${allReservations.length}\n`);

  allReservations.forEach((res, index) => {
    console.log(`${index + 1}. ID: ${res.getId()}`);
    console.log(`   Type: ${res.getCarType()}`);
    console.log(
      `   Dates: ${res.getStartDate().toDateString()} - ${res.getEndDate().toDateString()}`,
    );
    console.log(`   Cost: $${res.getTotalCost()}`);
  });

  // Cancel a reservation
  printSubsection("7. Canceling a Reservation");
  console.log(`Canceling reservation ${reservation2.getId()}...`);
  system.cancelReservation(reservation2.getId());
  console.log("✓ Reservation cancelled successfully");

  printStats(system);

  // Rebooking the freed car
  printSubsection("8. Rebooking the Freed Car");
  console.log("Booking an SUV for the same dates as the cancelled reservation...");

  const rebookStart = new Date(reservation2.getStartDate());
  const reservation7 = system.reserveCar(CarType.SUV, rebookStart, 2);
  console.log(`✓ New Reservation ID: ${reservation7.getId()}`);
  console.log(`  Cost: $${reservation7.getTotalCost()}`);

  printStats(system);

  // Try to book on an overlapping date
  printSubsection("9. Testing Date Conflict Prevention");
  console.log("Original reservation 1 dates:");
  console.log(`  Start: ${reservation1.getStartDate().toDateString()}`);
  console.log(`  End: ${reservation1.getEndDate().toDateString()}`);

  const conflictDate = new Date(reservation1.getStartDate());
  conflictDate.setDate(conflictDate.getDate() + 1);

  console.log(
    `\nAttempting to book the same car on overlapping date (${conflictDate.toDateString()})...`,
  );
  try {
    system.reserveCar(CarType.SEDAN, conflictDate, 2);
  } catch (error) {
    console.log(`✗ Error: ${(error as Error).message}`);
  }

  // Book after the original reservation ends
  console.log(
    `\nBooking after the original reservation ends (${reservation1.getEndDate().toDateString()})...`,
  );
  try {
    const afterOriginalRes = system.reserveCar(CarType.SEDAN, reservation1.getEndDate(), 1);
    console.log(`✓ Successfully booked (ID: ${afterOriginalRes.getId()})`);
  } catch (error) {
    console.log(`✗ Cannot book: All Sedans are currently booked for that period`);
  }

  printStats(system);

  // Error handling demonstrations
  printSubsection("10. Error Handling");

  // Negative days
  console.log("Attempting to book with 0 days:");
  try {
    const bookDate = new Date();
    bookDate.setDate(bookDate.getDate() + 1);
    system.reserveCar(CarType.SEDAN, bookDate, 0);
  } catch (error) {
    console.log(`✗ Error: ${(error as Error).message}`);
  }

  // Past date
  console.log("\nAttempting to book with a past date:");
  try {
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 1);
    system.reserveCar(CarType.SEDAN, pastDate, 1);
  } catch (error) {
    console.log(`✗ Error: ${(error as Error).message}`);
  }

  // Non-existent reservation
  console.log("\nAttempting to cancel a non-existent reservation:");
  try {
    system.cancelReservation("RES-999");
  } catch (error) {
    console.log(`✗ Error: ${(error as Error).message}`);
  }

  // Final summary
  printSection("📊 FINAL SUMMARY");
  printStats(system);

  console.log("\n\n✅ Demonstration completed successfully!");
  console.log("\nThe Car Rental System successfully demonstrates:");
  console.log("  ✓ Fleet initialization and management");
  console.log("  ✓ Dynamic pricing configuration");
  console.log("  ✓ Car reservation with date validation");
  console.log("  ✓ Conflict prevention and double-booking protection");
  console.log("  ✓ Reservation cancellation and rebooking");
  console.log("  ✓ Complex reservation scenarios");
  console.log("  ✓ Comprehensive error handling");
  console.log("  ✓ Real-time inventory tracking\n");
}

// Run the demonstration
runCarRentalDemo();
