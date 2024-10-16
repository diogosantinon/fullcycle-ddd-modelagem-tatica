import { Sequelize } from "sequelize-typescript";
import CustomerCreatedEvent from "./customer-created.event";
import CustomerModel from "../../infrastructure/db/sequelize/model/customer.model";
import EventDispatcher from "../@shared/event-dispatcher";
import SendConsoleLog1Handler from "./handler/send-console-log1.handler";
import SendConsoleLog2Handler from "./handler/send-console-log2.handler";
import CustomerRepository from "../../infrastructure/repository/customer.repository";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";

describe("Customer created events tests", () => {
  let sequelize: Sequelize;
  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([CustomerModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should register customer created events handler", () => {

    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLog1Handler();
    const eventHandler2 = new SendConsoleLog2Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"]).toBeDefined();
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"].length).toBe(2);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

  });

  it("should notify customer created event handlers", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLog1Handler();
    const eventHandler2 = new SendConsoleLog2Handler();
    eventDispatcher.register("CustomerCreatedEvent", eventHandler);
    eventDispatcher.register("CustomerCreatedEvent", eventHandler2);
    const spy1EventHandler = jest.spyOn(eventHandler, "handle");
    const spy2EventHandler = jest.spyOn(eventHandler2, "handle");

    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][0]).toMatchObject(eventHandler);
    expect(eventDispatcher.getEventHandlers["CustomerCreatedEvent"][1]).toMatchObject(eventHandler2);

    const customerRepository = new CustomerRepository();
    const customer = new Customer("1", "Test 123");
    const address = new Address("Street A", 999, "Zipcode A", "City A");
    customer.Address = address;

    await customerRepository.create(customer);

    const customerCreatedEvent = new CustomerCreatedEvent(customer);

    eventDispatcher.notify(customerCreatedEvent);

    expect(spy1EventHandler).toHaveBeenCalled();
    expect(spy2EventHandler).toHaveBeenCalled();
  });

})