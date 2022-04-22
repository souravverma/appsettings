import { Router } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";

const swaggerRouter: Router = Router();

const swaggerJsDocOpts = {
  swaggerDefinition: {
    // Like the one described here: https://swagger.io/specification/#infoObject
    swagger: "2.0",
    info: {
      title: "Harness API",
      version: require("../../../package.json").version,
      description: "A Core ELEC API to manage Harness data",
    },
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
      },
    },
    tags: [
      {
        name: "Circuit",
        description: 'Access to all "Circuit" data from database',
      },
      {
        name: "Aircraft Program",
        description: 'Access to "Aircraft Program" data from database',
      },
      {
        name: "Component",
        description: 'Access to "Component" data from database',
      },
      {
        name: "Functional Item",
        description: 'Access to "Functional Item" data from database',
      },
      {
        name: "Harness 3d Design Solution",
        description:
          'Access to "Harness 3d Design Solution" data from database',
      },
      {
        name: "Part Zone",
        description: 'Access to "Part Zone" data from database',
      },
      {
        name: "Branch 3D",
        description: 'Access to "Branch 3D" data from database',
      },
      {
        name: "Branch 3d Extremity Solution",
        description:
          'Access to "Branch 3d Extremity Solution" data from database',
      },
      {
        name: "Covering Element 3D",
        description: 'Access to "CoveringElement3D" data from database',
      },
      {
        name: "Functional Item 3d Solution",
        description: 'Access to "functionalItem3dSolution" data from database',
      },
      {
        name: "Backshell 3D Solution",
        description: 'Access to "Backshell3DSolution" data from database',
      },
      {
        name: "Part Zone Management",
        description: "API for Part Zone Management purpose",
      },
      {
        name: "Synchronize APS",
        description: "API for Synchronize APS and Adap-pz-CI",
      },
      {
        name: "File",
        description: "Store and get files data",
      },
      {
        name: "Admin",
        description: "Admin control, password protected",
      },
    ],
  },
  // apis: ['src/v2/routes/*.ts'], // List of files to be processes. You can also set globs './routes/*.js'
  apis: ["src/v2/swaggerDocs/**/*.yaml"],
  basePath: "/", // Base path (optional)
};

const swaggerDocument = swaggerJsDoc(swaggerJsDocOpts);

const swaggerUiOpts = {
  explorer: true,
  customCss: `
    /* disable topbar */
    body > svg,
    .swagger-ui .topbar {
        display: none;
    }
    /* Add blue background */
    #swagger-ui::before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        height: 145px;
        width:100%;
        background: #00205b
    }
    /* Header top */
    .swagger-ui .info {
        position: relative;
        margin: 0;
        padding: 30px 0;
        color: white;
        margin-bottom: 40px;
    }
    .swagger-ui .info .title {
        color: white;
    }
    .swagger-ui .info::after {
        content: url('https://www.airbus.com/content/dam/corporate-topics/branding/logos/Airbus_white.png');
        position: absolute;
        top: 50%;
        right: 15px;
        transform: translateY(-50%);
    }
    /* disable Authorize bannner */
    // .swagger-ui .scheme-container {
    //     display: none;
    //     padding: 15px 0;
    // }
    /* Custom render */
    .swagger-ui .opblock .opblock-summary-method,
    .swagger-ui .opblock,
    .swagger-ui section.models,
    .swagger-ui section.models .model-container {
        border-radius: 0px;
        box-shadow: none;
    }
    .swagger-ui .opblock {
        margin: 15px 0 0 0;
        background: none !important;
    }
    .swagger-ui .opblock .opblock-summary {
        padding: 10px;
    }
    .swagger-ui .opblock .opblock-summary-description {
        text-align: right;
        padding-right: 15px;
        font-weight: 700;
    }
    .swagger-ui .opblock-tag-section {
        border: 1px solid rgba(59,65,81,.3);
        padding: 15px;
    }
    .swagger-ui .opblock-tag {
        margin: 0px;
        border: none;
    }
    .swagger-ui .opblock-description-wrapper {
        font-size: 15px;
        font-weight: 700;
    }
    .swagger-ui .btn,
    .swagger-ui select {
        border-radius: 0px;
        border: 1px solid gray;
    }
    /* Custom Model render */
    .swagger-ui section.models,
    .swagger-ui section.models.is-open {
        padding: 15px;
    }
    .swagger-ui section.models h4,
    .swagger-ui section.models.is-open h4 {
        color: #3b4151;
        text-transform: uppercase;
        font-size: 20px;
        margin: 0;
        border: none;
    }
    .swagger-ui section.models .model-container,
    .swagger-ui section.models .model-container:first-of-type,
    .swagger-ui section.models .model-container:last-of-type {
        margin: 15px 0 0 0;;
        border-radius: 0px;
        background: none;
        border: 1px solid rgba(59,65,81,.3);
    }
    .swagger-ui .model-box {
        padding: 5px;
        background: rgba(0,0,0,.1);
        border-radius: 0px;
    }
    /* Custom Parametters Table */
    .swagger-ui .parameters-col_description input[type=text] {
        margin-left: 20px;
        border-radius: 0px;
    }
    .swagger-ui table.parameters {
        width: 100%;
        padding: 0px;
        display: flex;
        flex-direction: column;
    }
    .table-container{
        overflow: auto;
    }
    .swagger-ui table.parameters  {
        min-width: 700px;
    }
    .swagger-ui table.parameters > thead > tr,
    .swagger-ui table.parameters > tbody > tr {
        width: 100%;
        display: flex;
    }
    .swagger-ui table.parameters .col.col_header.parameters-col_name{
        width: 40%;
    }
    .swagger-ui table.parameters .col.col_header.parameters-col_description{
        width: 100%;
    }
    .swagger-ui table.parameters tbody td.parameters-col_name{
        width: 100%;
    }
    .swagger-ui table.parameters tbody td.parameters-col_description{
        min-width: 60%;
        width: 100%;
        align-items: center;
        justify-content: space-between;
    }
    .swagger-ui table.responses-table .model-box,
    .swagger-ui table.parameters .model-box,
    .swagger-ui table.parameters .body-param {
        width: 100%;
    }
    .swagger-ui .execute-wrapper {
        padding: 0px 20px;
    }
    .swagger-ui .execute-wrapper .btn {
        width: 100%;
        max-width: 340px;
        margin-bottom: 30px;
    }
    .swagger-ui .btn-group {
        padding: 0 20px;
        width: 100%;
        margin-bottom: 30px;
        justify-content: flex-end;
    }
    .swagger-ui .btn-group .btn {
        max-width: 169px;
        border-radius: 0px !important;
    }
    `,
};

const swaggerHtml = swaggerUi.generateHTML(swaggerDocument, swaggerUiOpts);

swaggerRouter.use("", swaggerUi.serveFiles(swaggerDocument, swaggerUiOpts));
swaggerRouter.get("", (req, res) => {
  res.send(swaggerHtml);
});

export default swaggerRouter;
