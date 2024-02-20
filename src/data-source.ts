import "reflect-metadata"
import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Product } from "./entity/Product"
import {Order} from "./entity/Order"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "localhost",
    port: 3306,
    username: "root",
    password: "",
    database: "test",
    synchronize: true,
    logging: false,
    entities:[User,Product,Order]
})
AppDataSource.initialize()
    .then(() => {
        console.log("Server is connecting Successfully");
    })
    .catch((error) => console.log(error))