const generateMigrationDate = () => {
  const now = new Date();
  const isoDate = now.toISOString().replaceAll(/\D/g, '').slice(0, 14); // Remove non-numeric characters and keep the first 14 characters

  return isoDate;
};

export default function (plop) {
  plop.setGenerator('migration', {
    actions: () => {
      return [
        {
          path: `migrations/${generateMigrationDate()}_{{name}}.ts`,
          templateFile: 'plop-templates/migration.hbs',
          type: 'add',
        },
      ];
    },
    description: 'migration file',
    prompts: [
      {
        message: 'migration name',
        name: 'name',
        type: 'input',
      },
    ],
  });
}
