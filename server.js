const express = require("express");
const app = express();
const tasksRouter = require("./routes/linksRoutes");
const usersRouter = require("./routes/usersRoutes");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/", tasksRouter);
app.use("/", usersRouter);

app.listen(5000, () => console.log(`Server on...`));
