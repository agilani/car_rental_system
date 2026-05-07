import { Test } from "@nestjs/testing";
import { ValidationPipe } from "@nestjs/common";
import { INestApplication } from "@nestjs/common";
import request from "supertest";
import { AppModule } from "../app.module";

describe("Car Rental API (e2e)", () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

    app = moduleRef.createNestApplication();
    app.useGlobalPipes(
      new ValidationPipe({
        whitelist: true,
        transform: true,
        forbidNonWhitelisted: true,
      }),
    );

    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  beforeEach(async () => {
    await request(app.getHttpServer())
      .post("/fleet/init")
      .send({ sedanCount: 2, suvCount: 1, vanCount: 1 })
      .expect(201);

    await request(app.getHttpServer())
      .post("/fleet/pricing")
      .send({ carType: "SEDAN", pricePerDay: 50 })
      .expect(201);

    await request(app.getHttpServer())
      .post("/fleet/pricing")
      .send({ carType: "SUV", pricePerDay: 75 })
      .expect(201);

    await request(app.getHttpServer())
      .post("/fleet/pricing")
      .send({ carType: "VAN", pricePerDay: 100 })
      .expect(201);
  });

  it("should return fleet statistics", async () => {
    const response = await request(app.getHttpServer()).get("/fleet/stats").expect(200);
    expect(response.body.totalCars).toBe(4);
    expect(response.body.carsByType.SEDAN).toBe(2);
  });

  it("should set pricing and return pricing data", async () => {
    await request(app.getHttpServer())
      .post("/fleet/pricing")
      .send({ carType: "SEDAN", pricePerDay: 65 })
      .expect(201);

    const response = await request(app.getHttpServer()).get("/fleet/pricing/SEDAN").expect(200);
    expect(response.body.pricePerDay).toBe(65);
  });

  it("should create, retrieve, and cancel a reservation", async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);

    const createResponse = await request(app.getHttpServer())
      .post("/reservations")
      .send({
        carType: "SEDAN",
        startDate: startDate.toISOString(),
        numberOfDays: 2,
      })
      .expect(201);

    expect(createResponse.body).toHaveProperty("id");
    expect(createResponse.body.totalCost).toBe(100);

    const reservationId = createResponse.body.id;

    const getResponse = await request(app.getHttpServer())
      .get(`/reservations/${reservationId}`)
      .expect(200);

    expect(getResponse.body.id).toBe(reservationId);
    expect(getResponse.body.carType).toBe("SEDAN");

    await request(app.getHttpServer()).delete(`/reservations/${reservationId}`).expect(200);
  });

  it("should list all reservations", async () => {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() + 1);

    await request(app.getHttpServer())
      .post("/reservations")
      .send({
        carType: "SEDAN",
        startDate: startDate.toISOString(),
        numberOfDays: 1,
      })
      .expect(201);

    const response = await request(app.getHttpServer()).get("/reservations").expect(200);
    expect(Array.isArray(response.body.reservations)).toBe(true);
    expect(response.body.reservations.length).toBeGreaterThanOrEqual(1);
  });

  it("should return available cars by type", async () => {
    const response = await request(app.getHttpServer())
      .get("/fleet/available")
      .query({ type: "SEDAN" })
      .expect(200);

    expect(response.body.carType).toBe("SEDAN");
    expect(Array.isArray(response.body.availableCars)).toBe(true);
  });
});
