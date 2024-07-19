import type { Knex } from "knex";

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("fixtures", (table) => {
    table.increments("id").primary();

    // Foreign keys referencing teams
    table
      .integer("home_team_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("teams")
      .onDelete("CASCADE");
    table
      .integer("away_team_id")
      .unsigned()
      .notNullable()
      .references("id")
      .inTable("teams")
      .onDelete("CASCADE");

    // Scores
    table.integer("home_team_score").notNullable();
    table.integer("away_team_score").notNullable();

    // Played status
    table.boolean("played").notNullable().defaultTo(false);

    // Date and time
    table.timestamp("time").notNullable();

    // Venue
    table.string("venue").notNullable();

    // Official reference
    table
      .integer("official_id")
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

    // Indexes
    table.index(["home_team_id", "away_team_id"]);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("fixtures");
}
