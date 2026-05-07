# AI Prompts

This project was created using the Generative AI Ms CoPilot. Following are prompts and their iteration to achieve the final version of the project.

## Iteration 1: Basic Car Rental System

Create a TypeScript class-based car rental system with the following features:

- A Car class with id, type, and availability status
- A Reservation class with id, car reference, start/end dates, and cost
- A CarRentalSystem class that can:
  - Add cars to fleet
  - Reserve a car for specific dates
  - Calculate total cost based on days
  - Basic validation (no past dates, positive days)
Use proper OOP principles with private fields and getter methods

## Iteration 2: Multiple Car Types and Pricing

Enhance the car rental system with:

- An enum for car types: SEDAN, SUV, VAN
- Dynamic pricing configuration (different rates per car type)
- Fleet initialization with specific counts per type
- Update the Car and Reservation classes to use the enum
- Add pricing methods to CarRentalSystem
- Ensure cost calculation uses the correct pricing
Add proper TypeScript types and interfaces

## Iteration 3: Conflict Prevention and Availability

Add conflict prevention to the car rental system:

- Implement date overlap checking to prevent double-booking
- Add availability checking methods
- Ensure reservations only succeed if car is available for the entire period
- Add methods to query available cars by type
- Update reservation logic to find available cars automatically
- Add comprehensive error messages for booking conflicts
Improve code organization with private helper methods

## Iteration 4: Cancellation and Advanced Features

Extend the car rental system with:

- Reservation cancellation functionality
- Fleet statistics and reporting
- Better error handling with custom error types
- Reservation retrieval by ID
- List all active reservations
- Update availability tracking after cancellations
- Add input validation for all public methods
Refactor for better maintainability and add JSDoc comments

## Iteration 5: Comprehensive Testing

Add comprehensive unit tests for the car rental system using Jest:

- Test all classes and their methods
- Cover happy path and error scenarios
- Test fleet initialization and statistics
- Test pricing configuration
- Test reservation creation, conflict prevention, and cancellation
- Test availability queries and edge cases
- Add integration tests for complex scenarios
- Aim for high test coverage (>90%)
Configure Jest with TypeScript support

## Iteration 6: Demonstration and Polish

Create an interactive demonstration runner that showcases:

- Fleet setup with realistic car counts
- Multiple reservation scenarios
- Conflict prevention examples
- Cancellation and rebooking
- Error handling demonstrations
- Real-time statistics display
- Formatted console output with sections
Add package.json with proper scripts, TypeScript configuration, and project documentation.
Ensure the code follows TypeScript best practices and has no linting errors.