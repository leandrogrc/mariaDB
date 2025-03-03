const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const linksRouter = require("./routes/linksRoutes");
const usersRouter = require("./routes/usersRoutes");
const authRouter = require("./routes/authRoutes");

app.set("view engine", "ejs");

app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use("/", authRouter);
app.use("/links", linksRouter);
app.use("/users", usersRouter);

app.use("*", (_req, res) => res.status(400).render("not-found"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
