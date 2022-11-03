import fs from "fs";
import { HTTP_HOST, HTTP_PORT, initkey } from "./config/index";
import express, { Express } from "express";
import { myDataSource } from "./app-data-source";
import { router } from "./certificate/certificate.controller";
import path from "path";
import { config } from "dotenv";
// import ('dotenv').config()
config();
console.log(process.env.HTTP_PORT);
console.log(process.env.HTTP_HOST);

// app.listen(HTTP_PORT, () => {
//   console.log(`Server: http://${HTTP_HOST}:${HTTP_PORT}`);
// });
async function start() {
  const keys = JSON.parse(fs.readFileSync("src/config/key.json", "utf8"));
  initkey(keys);

  const app: Express = express();

  //app.use(logger("dev"));
  app.use(express.json());
  app.use(express.urlencoded({ extended: false }));
  app.set("view engine", "ejs");
  app.set("views", path.join("src", "views"));

  app.use("/", router);
  await myDataSource
    .initialize()
    .then(() => {})
    .catch((err: any) => {
      console.error("Error during Data Source initialization:", err);
    });
  app.listen(HTTP_PORT, () => {
    console.log(`Server: http://${HTTP_HOST}:${HTTP_PORT}`);
  });
}
start();
