# Enhancement Prompts

## NestJs based project

Convert the existing TypeScript car rental system into a NestJS application.

Requirements:

- Preserve the existing domain logic for Car, Reservation, CarType, and CarRentalSystem.
- Implement a NestJS module structure:
  - `CarsModule`
  - `ReservationsModule`
  - `AppModule`
- Move business logic into a NestJS service (`CarRentalService`) and keep models for `Car` and `Reservation`.
- Create REST controllers with endpoints for each operation:
  - POST `/fleet/init` — initialize fleet counts for sedan, suv, van
  - POST `/fleet/pricing` — set per-day pricing for a car type
  - GET `/fleet/pricing/:type` — get pricing for a car type
  - GET `/fleet/available` — list available cars by type
  - GET `/fleet/stats` — return fleet statistics
  - POST `/reservations` — reserve a car with type, start date, and days
  - DELETE `/reservations/:id` — cancel a reservation
  - GET `/reservations/:id` — get reservation details
  - GET `/reservations` — list all reservations
- Use NestJS DTOs and validation pipes for request payloads.
- Keep in-memory storage for now, but design the service so persistence can be added later.
- Add example request/response shapes and make sure endpoints return JSON.
- Include NestJS testing scaffolding with Jest and SuperTest for the new API controllers.

## Add validation + DTO

Refine the conversion to include NestJS DTO classes with `class-validator` decorators for all request bodies, and apply `ValidationPipe` globally.

## Add API Documentation

Improve the NestJS app by adding Swagger decorators and a generated OpenAPI UI for all fleet and reservation endpoints.

## Add persistance adapter

Enhance the NestJS service to use a repository pattern so the in-memory implementation can later be replaced by TypeORM or Prisma without changing controllers.

## Linter

Enhance the codebase with lint and prettier. Setup prettier and lint to follow industry standards. Modify code if requires