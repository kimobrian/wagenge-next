import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("teams", (table) => {
    table.increments("id").primary();
    table.string("name").notNullable();
    table.string("logo"); // Upload logo and save link to
    table.string("location");
    table.string("homeground");
    table.string("team_photo");
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropMaterializedView("teams");
}
