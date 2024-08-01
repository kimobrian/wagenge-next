import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("media", (table) => {
    table.increments("id").primary();
    table.integer("fixture_id").unsigned().notNullable();

    table.specificType("links", "varchar(255)[]").notNullable();

    table
      .foreign("fixture_id")
      .references("id")
      .inTable("fixtures")
      .onDelete("CASCADE");
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable("media");
}
