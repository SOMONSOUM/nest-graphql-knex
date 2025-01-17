import { Knex } from 'knex';

const tableName = 'roles';

export async function up(knex: Knex): Promise<void> {
  if (!(await knex.schema.hasTable(tableName))) {
    return await knex.schema.createTable(tableName, function (table) {
      table.increments();
      table.string('name');
      table.timestamps(true, true);
    });
  }
}

export async function down(knex: Knex): Promise<void> {
  return await knex.schema.dropTable(tableName);
}
