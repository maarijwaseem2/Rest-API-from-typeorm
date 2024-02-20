// import { AppDataSource } from "./data-source"
// import { User } from "./entity/User"

// AppDataSource.initialize().then(async () => {

//     console.log("Inserting a new user into the database...")
//     const user = new User()
//     user.firstName = "Timber"
//     user.lastName = "Saw"
//     user.age = 25
//     await AppDataSource.manager.save(user)
//     console.log("Saved a new user with id: " + user.id)

//     console.log("Loading users from the database...")
//     const users = await AppDataSource.manager.find(User)
//     console.log("Loaded users: ", users)

//     console.log("Here you can setup and run express / fastify / any other framework.")

// }).catch(error => console.log(error))
import express, { Application, Request, Response, NextFunction } from "express";
import morgan from "morgan";
import bodyParser from "body-parser";
import ProductRoutes from "./routes/products";
import OrderRoutes from "./routes/orders";
import userRoutes from "./routes/user";
require("dotenv").config();

const app: Application = express();

app.use(morgan("dev"));
app.use("/uploads", express.static("uploads"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use((req: Request, res: Response, next: NextFunction) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type,Accept, Authorization"
  );

  if(req.method === "OPTIONS"){
    res.header("Access-Control-Allow-Methods","PUT, POST, PATCH, DELETE, GET");
    return res.status(200).json({});
}
next();
});

app.use("/products", ProductRoutes);
app.use("/orders", OrderRoutes);
app.use("/user", userRoutes);

interface errorMessage extends Error {
    status?: number;
}
app.use((req: Request, res: Response, next: NextFunction) => {
    const err: Error = new Error('Not Found');
    res.status(404);
    next(err);
});

app.use((err: errorMessage, req: Request, res: Response, next: NextFunction) => {
    res.status(err.status || 500);
    res.json({
        err: {
            message: err.message
        }
    });
});

export default app;