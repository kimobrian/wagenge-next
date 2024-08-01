import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("payments", (table) => {
    table.increments("id").primary();
    table
      .integer("member_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");
    table
      .enu("purpose", ["social_fund", "welfare", "subscription"])
      .notNullable();

    table.enu("year", ["2024", "2025", "2026", "2027", "2028"]).notNullable();
    table
      .enu("month", ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "10"])
      .notNullable();
    table.integer("amount").notNullable();
    table.integer("expected");
    table.integer("balance");

    // Foreign key referencing fixtures
    table
      .integer("fixture_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("fixtures");

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("payments");
}
