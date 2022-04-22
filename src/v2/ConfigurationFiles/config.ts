// getting auth token from .env file
export const config = {
  apsUrl: `${process.env.APS_URL}`,
  authUrl: process.env.CE_AUTH_URL,
  partzoneApiVersion: require("../../../package.json").version,
};
