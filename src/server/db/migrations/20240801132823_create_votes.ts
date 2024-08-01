import type { Knex } from "knex";

enum Position {
  BestDefender = "best_defender",
  BestMidfielder = "best_midfielder",
  BestAttacker = "best_attacker",
  ManOfTheMatch = "man_of_the_match",
}

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable("votes", (table) => {
    table.increments("id").primary();
    table.integer("voter_id").unsigned().notNullable(); // ID of the voter
    table.integer("fixture_id").unsigned().notNullable(); // ID of the fixture/match
    table.enu("position", Object.values(Position)).notNullable(); // Enum for voting positions
    table.integer("player_id").unsigned().notNullable(); // ID of the player they voted for

    table
      .foreign("voter_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");
    table
      .foreign("fixture_id")
      .references("id")
      .inTable("fixtures")
      .onDelete("CASCADE");
    table
      .foreign("player_id")
      .references("id")
      .inTable("users")
      .onDelete("CASCADE");

    // Ensure unique votes for each position and fixture
    table.unique(["fixture_id", "position", "voter_id"]);

    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists("votes");
}
