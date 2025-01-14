const express = require("express");
const app = express();
const linksRouter = require("./routes/linksRoutes");
const usersRouter = require("./routes/usersRoutes");
const cors = require("cors");

app.use(cors());
app.use(express.json());
app.use("/", linksRouter);
app.use("/", usersRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
