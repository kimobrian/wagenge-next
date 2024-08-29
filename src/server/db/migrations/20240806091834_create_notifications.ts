import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("notifications", (table) => {
    table.increments("id").primary();
    table.string("title").notNullable();
    table.text("body").notNullable();
    table.enu("type", ["payment", "fixture", "announcement"]).notNullable();
    table.enu("urgency", ["low", "normal", "high"]).notNullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("notifications");
}
