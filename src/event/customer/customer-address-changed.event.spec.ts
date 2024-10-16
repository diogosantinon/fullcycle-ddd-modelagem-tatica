import { Sequelize } from "sequelize-typescript";
import CustomerModel from "../../infrastructure/db/sequelize/model/customer.model";
import EventDispatcher from "../@shared/event-dispatcher";
import Customer from "../../domain/entity/customer";
import Address from "../../domain/entity/address";
import CustomerAddressChangedEvent from "./customer-address-changed.event";
import SendConsoleLogHandler from "./handler/send-console-log.handler";

describe("Customer address changed events tests", () => {
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

  it("should notify customer changed address event handlers", async () => {
    const eventDispatcher = new EventDispatcher();
    const eventHandler = new SendConsoleLogHandler();

    eventDispatcher.register("CustomerAddressChangedEvent", eventHandler);
    
    expect(eventDispatcher.getEventHandlers["CustomerAddressChangedEvent"][0]).toMatchObject(eventHandler);
    
    const spy1EventHandler = jest.spyOn(eventHandler, "handle");

    const customer = new Customer("1", "Test 123");
    const address = new Address("Street A", 999, "Zipcode A", "City A");
    customer.Address = address;
    customer.addRewardPoints(10);
    customer.activate();

    const address2 = new Address("Street B", 111, "Zipcode B", "City B");
    customer.changeAddress(address2)

    const customerChangedAddressEvent = new CustomerAddressChangedEvent(customer);
    eventDispatcher.notify(customerChangedAddressEvent);

    expect(spy1EventHandler).toHaveBeenCalled();

  });

})