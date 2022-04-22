# Creating a separate testing service

This is a set of OpenShift config files is used to create a specific service, on OpenShift DEV environemnt.

This service is intented to be used to perform tests without affecting dev/va/prod environemnts.

The service is named `ce-api-harness-testing`, exposed through  
- `https://ce-api-harness-testing-1t21-d.epaas.eu.airbus.corp/`

API doc is here: `https://ce-api-harness-testing-1t21-d.epaas.eu.airbus.corp/api/v2/docs/`


## How to (re)create the service

1. Import `imagestream-testing.yml` to create the imagestream on OpenShift dev console.
2. Import `build-testing.yml` to create (and trigger) a build configuration on OpenShift dev console.
3. Import `service-testing.yml` to create the service
4. Verify/Update the service environment or secrets.
5. Import `route-testing.yml` to create the routes.
6. Update the SSL route to use the relevant Airbus SSL certificate (and redirect http traffic to https).

## Principle 

- I copied (extracted) existing config file from 1t21-ce-api-harness dev environment.
- I removed UID references.
- I replaced all names prefixed by `ce-api-harness` by `ce-api-harness-testing`.
- We get the files commited here.
- Imported new files
- In case environment needs to be recreated later, SSL certificate is stored in AWS secret manager under the name `ce-api-harness-testing-epaas-dev-certificate`, you can request it from CE Enabler team.

## WARNING - how to change the branch used

The  (re)deployment of this service is not directly managed as a other dev/val/prod branches of the jenkins pipeline. Instead it is triggered by openshift itself, pulling changes for the dev branch directly from git repository.

If you want to point this service to a different branch, you just have to update the openshift  build configuration.
Actual configuration is similar to the content of (`build-testing.yml`) but you can do it directly in OpenShift Web Gui.

To use a different branch change the `ref` parameter of the git `source`  (targeting the `dev` branch at the moment, see below).

```
 source:
    git:
      ref: dev
      uri: >-
        https://@github.airbus.corp/Airbus/1t21-ce-api-harness.git
    secrets:
      - secret:
```
