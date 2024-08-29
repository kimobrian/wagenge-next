import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("attendance", (table) => {
    table.increments("id").primary();
    table.date("fixture_date").notNullable();

    table
      .integer("member_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table.enu("attended", ["yes", "no"]).defaultTo("no");
    table.enu("available", ["yes", "no", "N/A"]).defaultTo("N/A");

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("attendance");
}
