import { HTTP_HOST, HTTP_PORT } from "./config/index";
import express, { Express } from "express";
import { myDataSource } from "./app-data-source";
import { router } from "./certificate/certificate.controller";

const app: Express = express();

//app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/", router);
// app.listen(HTTP_PORT, () => {
//   console.log(`Server: http://${HTTP_HOST}:${HTTP_PORT}`);
// });

myDataSource
  .initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
    app.listen(HTTP_PORT, () => {
      console.log(`Server: http://${HTTP_HOST}:${HTTP_PORT}`);
    });
  })
  .catch((err: any) => {
    console.error("Error during Data Source initialization:", err);
  });
