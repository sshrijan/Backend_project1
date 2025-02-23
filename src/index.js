// require('dotenv').config({path: "./env"})
import dotenv from "dotenv";
import CONNECT_DB from "./db/index.js";
import {app} from "./app.js"

dotenv.config({
    path: './.env'
})

CONNECT_DB()

.then(() => {
    const port = process.env.PORT || 4000 || 5000;
    app.listen(port, () => {
        console.log(`Server is running at Port ${port}`);
    })
})
.catch((error) => {
    console.log(`Database connection ERROR !`,error)
})