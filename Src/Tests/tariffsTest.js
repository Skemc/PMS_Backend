// Tests/tariffs.test.js
import { Sequelize } from "sequelize";
import initModels from "../Models/index.js";
import initTariffService from "../Services/tariffService.js";

test("tariff service create, get & set", async () => {
  const sequelize = new Sequelize("sqlite::memory:", { logging: false });
  const models = await initModels(sequelize, Sequelize);
  await models.sequelize.sync({ force: true });

  const service = initTariffService(models);
  const created = await service.create({ key: "test.rate", name: "Test rate", value: 123.45 });
  expect(created.key).toBe("test.rate");

  const val = await service.get("test.rate");
  expect(Number(val)).toBe(123.45);

  const updated = await service.set("test.rate", 200);
  expect(Number(updated.value)).toBe(200);

  await sequelize.close();
});
