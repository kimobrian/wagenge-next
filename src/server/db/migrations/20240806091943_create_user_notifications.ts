import { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("user_notifications", (table) => {
    table.increments("id").primary();
    table
      .integer("user_id")
      .unsigned()
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .integer("notification_id")
      .unsigned()
      .references("id")
      .inTable("notifications")
      .onDelete("CASCADE");
    table
      .enu("sent_status", ["pending", "sent", "failed"])
      .defaultTo("pending");
    table.boolean("read_status").defaultTo(false);
    table.timestamp("sent_at").nullable();
    table.timestamp("read_at").nullable();
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("user_notifications");
}
