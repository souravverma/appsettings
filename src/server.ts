import app from "./app";
import db from "./database";
// import seeder from './seeders/Seeder';
// import parametricsSeeder from './seeders/Parametrics.seeder';

function startApp() {
  console.log(
    "Your Wonderfull App is running at http://localhost:%d in %s mode",
    app.get("port"),
    app.get("env"),
    "\n  Press CTRL-C to stop\n"
  );
}

(async () => {
  // // Schema creation
  // const schemas = await db.showAllSchemas({ logging: false });
  // if (!schemas.includes(process.env.DB_SCHEMAV1)) {
  //   await db.createSchema(process.env.DB_SCHEMAV1, { logging: true });
  // }
  // if (!schemas.includes(process.env.DB_SCHEMAV2)) {
  //   await db.createSchema(process.env.DB_SCHEMAV2, { logging: true });
  // }

  // db.addModels([__dirname + '/v1/models']);
  // Sync Models with database
  // await db.sync({ force: false }) // set to true for testing
  //   .catch((err: any) => {
  //     console.error('Sync Error: ', err);
  //   }); // Start synchronisation db

  db.addModels([__dirname + "/v2/models"]);
  // await db.sync({ force: true }) // set to true for testing
  // .catch((err: any) => {
  //   console.error('Sync Error: ', err);
  // }); // Start synchronisation db

  // /* UNCOMMENT BELOW TO RUN PARAMETRICS TABLES SEEDS /!\ LOCAL PURPOSE ONLY /!\ */
  // await parametricsSeeder.start();

  // Connexion to the database
  await db
    .authenticate() // Verify the DB Connection
    .then(() => {
      console.log("DB connection has been established successfully!");
    })
    .catch((err: any) => {
      console.error(
        "The server did not start because it is unable to connect to the database:",
        err
      );
    });

  const runSeeds: string | boolean = process.env.NEED_SEEDS || false; // Set to true to run the seeders. Should be used for dev purpose only!
  if (runSeeds === "true") {
    // await seeder.start();
  }

  const server = app.listen(app.get("port"), startApp);
  server.setTimeout(5 * 60 * 1000); // 5 Minutes
})();
