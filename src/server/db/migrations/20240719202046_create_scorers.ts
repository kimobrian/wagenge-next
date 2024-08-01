import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("scorers", (table) => {
    table.increments("id").primary();

    // Foreign key referencing fixtures
    table
      .integer("fixture_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("fixtures")
      .onDelete("CASCADE");

    table.enu("goal_for", ["wagenge", "opponent"]).notNullable();

    // Assists reference
    table
      .integer("assist_id")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    // Minute when the goal was scored
    table.integer("minute").unsigned().notNullable(); // Assuming minute is stored as an integer (e.g., 45)

    // Type of goal: Field goal, Penalty, Own goal
    table.enu("goal_type", ["F", "P", "O"]).notNullable(); // F = Field goal, P = Penalty, O = Own goal

    // Indexes for performance
    table.index(["fixture_id", "scorer_id"]);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("scorers");
}
