import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("fixtures", (table) => {
    table.increments("id").primary();

    table.enu("location", ["home", "away"]).defaultTo("home");

    // Venue
    table.string("venue").notNullable().defaultTo("TWO RIVERS FITNESS");
    // opponent team name
    table.string("opponent").notNullable();

    // Scores
    table.integer("wagenge_score").notNullable();
    table.integer("opponent_score").notNullable();

    // Played status
    table.boolean("played").notNullable().defaultTo(false);

    // Date and time
    table.timestamp("time").notNullable();

    // man of the match
    table
      .integer("motm")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table
      .integer("best_def")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table
      .integer("best_mid")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    table
      .integer("best_fwd")
      .unsigned()
      .nullable()
      .references("id")
      .inTable("users")
      .onDelete("SET NULL");

    // Scorers as JSON format
    /* Format
    [
      {
        "scorer": 1,
        "assist": 2,
        "time": "45",
        "type": "F" // fied goal
      },
      {
        "scorer": 3,
        "assist": 4,
        "time": "67",
        "type": "P" // penalty
      }
    ]
    */
    table.jsonb("scorers").defaultTo("[]");

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("fixtures");
}
