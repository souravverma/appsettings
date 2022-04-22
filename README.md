# ce-api-harness

A Core ELEC microservice API to store and read Harness data.
Follow this [link to access to the API](https://ce-api-harness-1t21-d.epaas.eu.airbus.corp/).

## Configuration


Start by duplicate the file **.env-example** and rename it to **.env**, to access your local database.

```javascript
//  ./.env
# Global
NODE_ENV=local
MS_NAME=ce-api-harness
PORT=80
# Postgres connection 
PGHOST=localhost
PGPORT=5432
PGDATABASE=postgres
PGUSER=postgres
PGPASSWORD=postgres
DB_SCHEMAV1=coreelecv1
DB_SCHEMAV2=coreelecv2
# Seeds: set to true to run seeds. Should not be used but on dev.
NEED_SEEDS=false
```

## API Documentation
[Api V1 Documentation](https://ce-api-harness-1t21-d.epaas.eu.airbus.corp/api/v1/docs) (Generated with Swagger).

[Api V2 Documentation](https://ce-api-harness-1t21-d.epaas.eu.airbus.corp/api/v2/docs) (Generated with Swagger).

## Available commands

### Development

```bash
npm start
```

### Development with auto re-compile

```bash
npm run watch
```

### Running tests

```bash
npm test
```

### Linting

```bash
npm run lint
```

### Build

```bash
npm run build
```

### Debug

```bash
npm run debug
```