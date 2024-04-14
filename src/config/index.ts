import merge from "lodash.merge";

process.env.NODE_ENV = process.env.NODE_ENV || "development";

const stage = process.env.STAGE || "local";

let envConfig;

switch (stage) {
  case "production":
    envConfig = require("./production").default;
    break;
  case "staging":
    envConfig = require("./staging").default;
    break;
  default:
    envConfig = require("./local").default;
    break;
}

export default merge(
  {
    stage,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET,
    port: process.env.PORT,
    logging: false,
  },
  envConfig
);
