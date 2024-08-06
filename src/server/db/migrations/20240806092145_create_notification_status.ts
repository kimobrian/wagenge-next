import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("notification_status", (table) => {
    table.increments("id").primary();
    table
      .integer("user_notification_id")
      .unsigned()
      .references("id")
      .inTable("user_notifications")
      .onDelete("CASCADE");
    table.enu("status", ["pending", "sent", "failed"]).notNullable();
    table.text("status_detail").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("notification_status");
}
