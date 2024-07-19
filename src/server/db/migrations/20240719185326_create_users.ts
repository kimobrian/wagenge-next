import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("users", (table) => {
    table.increments("id").primary();
    table.string("google_id").unique().notNullable();
    table.string("email").unique().notNullable();
    table.string("name"); // from google
    table.string("display_name"); // editable
    table.string("first_name");
    table.string("last_name");
    table.text("picture");
    table.text("refresh_token");
    table.text("google_refresh_token");
    table.timestamp("last_login");
    table
      .integer("team_id")
      .unsigned()
      .references("id")
      .inTable("teams")
      .onDelete("SET NULL");
    table.enu("role", ["admin", "player", "official"]).defaultTo("player");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("users");
}
