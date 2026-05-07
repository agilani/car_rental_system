import { Body, Controller, Get, Param, ParseEnumPipe, Post, Query } from "@nestjs/common";
import {
  ApiBody,
  ApiOkResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiTags,
  ApiCreatedResponse,
} from "@nestjs/swagger";
import { CarRentalService } from "../services/car-rental.service";
import { CarType } from "../types/CarType";
import { InitFleetDto } from "./dto/init-fleet.dto";
import { SetPricingDto } from "./dto/set-pricing.dto";
import { AvailableCarsQueryDto } from "./dto/available-cars-query.dto";

@ApiTags("Fleet")
@Controller("fleet")
export class CarsController {
  constructor(private readonly carRentalService: CarRentalService) {}

  @Post("init")
  @ApiOperation({ summary: "Initialize fleet inventory" })
  @ApiBody({ type: InitFleetDto })
  @ApiCreatedResponse({ description: "Fleet initialized successfully" })
  initializeFleet(@Body() body: InitFleetDto) {
    this.carRentalService.initializeFleet(body.sedanCount, body.suvCount, body.vanCount);

    return {
      message: "Fleet initialized successfully",
      fleet: body,
    };
  }

  @Post("pricing")
  @ApiOperation({ summary: "Set pricing for a car type" })
  @ApiBody({ type: SetPricingDto })
  @ApiCreatedResponse({ description: "Pricing updated successfully" })
  setPricing(@Body() body: SetPricingDto) {
    this.carRentalService.setPricing(body.carType, body.pricePerDay);
    return {
      message: "Pricing updated successfully",
      carType: body.carType,
      pricePerDay: body.pricePerDay,
    };
  }

  @Get("pricing/:type")
  @ApiOperation({ summary: "Get pricing for a car type" })
  @ApiParam({ name: "type", enum: CarType, example: CarType.SEDAN })
  @ApiOkResponse({ description: "Current pricing for the specified car type" })
  getPricing(@Param("type", new ParseEnumPipe(CarType)) type: CarType) {
    return {
      carType: type,
      pricePerDay: this.carRentalService.getPricing(type),
    };
  }

  @Get("available")
  @ApiOperation({ summary: "Get all available cars for a car type" })
  @ApiQuery({ name: "type", enum: CarType, example: CarType.SEDAN })
  @ApiOkResponse({ description: "List of available cars" })
  getAvailableCars(@Query() query: AvailableCarsQueryDto) {
    return {
      carType: query.type,
      availableCars: this.carRentalService.getAvailableCars(query.type).map((car) => ({
        id: car.getId(),
        type: car.getType(),
        available: car.isCarAvailable(),
      })),
    };
  }

  @Get("stats")
  @ApiOperation({ summary: "Get current fleet statistics" })
  @ApiOkResponse({ description: "Fleet statistics returned successfully" })
  getFleetStats() {
    return this.carRentalService.getFleetStats();
  }
}
