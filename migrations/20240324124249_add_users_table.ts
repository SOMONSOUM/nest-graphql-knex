import { Knex } from 'knex';

const tableName = 'users';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable(tableName))) {
    return await knex.schema.createTable(tableName, function (table) {
      table.increments();
      table.string('email');
      table.string('password');
      table.string('first_name');
      table.string('last_name');
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable(tableName);
}
