# 🚗 Car Rental System

A comprehensive Object-Oriented Programming (OOP) implementation of a **Car Rental System** using TypeScript. The system allows users to reserve cars of different types, manage pricing, and handle complex reservation scenarios.

## Requirements

View the [PDF page](./requirements.pdf).

## AI Powered

[Read the story here](./prompts.md)

## ✨ Features

### Core Functionality

- **Fleet Management**: Initialize and manage a fleet of cars (Sedan, SUV, Van)
- **Dynamic Pricing**: Set custom pricing for each car type
- **Reservation System**: Reserve cars with date and duration validation
- **Conflict Prevention**: Automatic detection and prevention of double-booking
- **Cancellation Management**: Cancel reservations and automatically free up cars for rebooking
- **Inventory Tracking**: Real-time availability and fleet statistics

### Car Types

- **Sedan**: 5-seater passenger vehicle ($50/day)
- **SUV**: Large 7-seater vehicle ($75/day)
- **Van**: Commercial transport vehicle ($100/day)

## 🏗️ Object-Oriented Design

The system is built with clean OOP principles:

### Classes

#### **CarType** (Enum)

Represents the three available car types: `SEDAN`, `SUV`, `VAN`

#### **Car**

Represents an individual car in the fleet

- Properties: `id`, `type`, `isAvailable`
- Methods:
  - `getId()`: Get car identifier
  - `getType()`: Get car type
  - `isCarAvailable()`: Check availability
  - `setAvailability()`: Update availability status

#### **Reservation**

Represents a car reservation

- Properties: `id`, `car`, `startDate`, `endDate`, `numberOfDays`, `totalCost`
- Methods:
  - `getId()`: Get reservation ID
  - `getCar()`: Get the reserved car
  - `getStartDate()`: Get start date
  - `getEndDate()`: Get end date
  - `getNumberOfDays()`: Get duration
  - `getTotalCost()`: Get total rental cost
  - `getCarType()`: Get car type

#### **CarRentalSystem**

Main service class managing all operations

- **Fleet Operations**:
  - `initializeFleet()`: Set up initial car inventory
  - `getAvailableCars()`: Query available cars by type
  - `getAllCars()`: Get all fleet cars
  - `getFleetStats()`: Get detailed statistics
  
- **Pricing Operations**:
  - `setPricing()`: Configure daily rates
  - `getPricing()`: Get rates for a car type
  
- **Reservation Operations**:
  - `reserveCar()`: Make a new reservation
  - `cancelReservation()`: Cancel an existing reservation
  - `getReservation()`: Retrieve reservation details
  - `getAllReservations()`: Get all active reservations

## 📋 Requirements Satisfied

✅ **Reservation System**: Users can reserve a car of given type at desired date/time for given days  
✅ **3 Car Types**: Sedan, SUV, and Van support  
✅ **Limited Inventory**: Each car type has limited quantity  
✅ **Unit Tests**: Comprehensive Jest test suite with 50+ test cases  
✅ **TypeScript**: Fully written in TypeScript with strict typing  
✅ **No API**: Runner file demonstrates all use cases  

## 🚀 Getting Started

### Prerequisites

- Node.js (v16+)
- npm or yarn

### Installation

```bash
# Install dependencies
npm install
```

### Running the System

#### Run the Demo

```bash
# Run the interactive demonstration
npm run runner

# Or with build step
npm start
```

#### Run Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Generate coverage report
npm run test:coverage
```

#### Build

```bash
# Compile TypeScript to JavaScript
npm run build
```

## 📁 Project Structure

```
car_rental_system/
├── src/
│   ├── types/
│   │   └── CarType.ts                 # Car type enum
│   ├── models/
│   │   ├── Car.ts                     # Car class
│   │   └── Reservation.ts             # Reservation class
│   ├── services/
│   │   └── CarRentalSystem.ts         # Main service class
│   ├── __tests__/
│   │   └── CarRentalSystem.test.ts    # Comprehensive test suite
│   └── runner.ts                      # Interactive demonstration
├── dist/                              # Compiled JavaScript
├── package.json
├── tsconfig.json
├── jest.config.js
└── README.md
```

## 🧪 Test Coverage

The test suite includes **50+ comprehensive tests** covering:

### Unit Tests

- **Fleet Initialization**: Creating and verifying car fleet setup
- **Pricing Configuration**: Setting and validating prices
- **Reservation Logic**: Making valid and invalid reservations
- **Date Conflict Detection**: Preventing double-booking
- **Cancellation**: Proper cleanup and rebooking
- **Availability Tracking**: Real-time inventory status
- **Error Handling**: All error scenarios

### Integration Tests

- **Multiple Simultaneous Reservations**: Complex booking scenarios
- **Staggered Bookings**: Sequential reservations on same car
- **Different Pricing Tiers**: Price calculations per car type
- **Fleet Statistics**: Accurate reporting of inventory

### Test Scenarios

#### ✅ Valid Operations

```typescript
// Reserve a Sedan for 3 days starting tomorrow
const startDate = new Date();
startDate.setDate(startDate.getDate() + 1);
const reservation = system.reserveCar(CarType.SEDAN, startDate, 3);
// Total cost calculated: 3 days × $50/day = $150
```

#### ✅ Conflict Prevention

```typescript
// Attempting to book the same car during overlapping period fails
// Original: May 10-12
// Attempt: May 11-14 → ERROR: Car already reserved
```

#### ✅ Error Handling

- Past dates: ❌ Cannot book in the past
- Invalid duration: ❌ Must book at least 1 day
- No availability: ❌ All cars of type booked for dates
- Non-existent reservation: ❌ Cannot cancel non-existent ID

## 💡 Usage Examples

### Example 1: Simple Reservation

```typescript
import { CarRentalSystem } from "./services/CarRentalSystem";
import { CarType } from "./types/CarType";

const system = new CarRentalSystem();
system.initializeFleet(5, 3, 2);

const startDate = new Date();
startDate.setDate(startDate.getDate() + 1);

const reservation = system.reserveCar(CarType.SEDAN, startDate, 3);
console.log(`Booked: ${reservation.getId()}`);
console.log(`Total: $${reservation.getTotalCost()}`);
```

### Example 2: Check Availability

```typescript
const availableSedans = system.getAvailableCars(CarType.SEDAN);
console.log(`Available Sedans: ${availableSedans.length}`);

const stats = system.getFleetStats();
console.log(`Total Available: ${stats.availableCars}`);
console.log(`Sedans: ${stats.availableCarsByType[CarType.SEDAN]}`);
```

### Example 3: Cancel and Rebook

```typescript
// Cancel a reservation
system.cancelReservation(reservation.getId());

// Car is now available for rebooking
const newReservation = system.reserveCar(CarType.SEDAN, startDate, 2);
```

## 🔍 Key Implementation Details

### Date Conflict Detection

The system uses an overlap detection algorithm:

```
Overlap occurs when: startDate < otherEnd AND endDate > otherStart
No overlap when: endDate <= otherStart OR startDate >= otherEnd
```

### Reservation Lifecycle

1. **Creation**: Validate inputs, find available car, create reservation
2. **Active**: Car marked as unavailable during reservation period
3. **Cancellation**: Car marked available, reservation removed
4. **Rebooking**: Same car immediately available for new dates

### Pricing Model

- Each car type has configurable daily rate
- Total cost = numberOfDays × pricePerDay
- Prices can be updated at runtime

## 🛡️ Error Handling

All error scenarios are handled with descriptive messages:

- Invalid dates (past dates, invalid duration)
- Unavailable inventory (no cars available for type/dates)
- Invalid operations (canceling non-existent reservations)
- Invalid configuration (negative pricing)

## 📊 Running the Demo

The `runner.ts` file provides an interactive demonstration showing:

1. ✅ Fleet initialization
2. ✅ Price configuration
3. ✅ Multiple reservations
4. ✅ Inventory management
5. ✅ Conflict prevention
6. ✅ Cancellation and rebooking
7. ✅ Error handling
8. ✅ Real-time statistics

**Output**: Colorized console output with detailed information about each operation

## 🎯 Design Patterns Used

- **Service Pattern**: CarRentalSystem acts as main service
- **Factory Pattern**: Car creation with unique IDs
- **Validation Pattern**: Input validation before operations
- **State Pattern**: Car availability states
- **Repository Pattern**: Cars and Reservations collections management

## 📈 Possible Enhancements

- Payment processing integration
- Customer profiles and booking history
- Insurance options
- Fuel policy management
- Late fee calculations
- Driver license validation
- Reviews and ratings system
- Multi-location support

## 📝 License

ISC

## 👨‍💻 Author

Created as a comprehensive demonstration of OOP principles in TypeScript

---

**Happy Renting! 🚗💨**

A car rental system using OOP principles
