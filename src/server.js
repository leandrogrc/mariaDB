require("dotenv").config();
const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const linksRouter = require("./routes/linksRoutes");
const usersRouter = require("./routes/usersRoutes");
const authRouter = require("./routes/authRoutes");
const csrf = require("./middlewares/csrf");

app.use(
  cors({
    methods: ["GET", "POST", "OPTIONS"],
    origin:
      process.env.NODE_ENV === "production" ? process.env.APP_DOMAIN : "*",
  })
);

app.set("view engine", "ejs");
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.urlencoded({ extended: true }));

app.use(csrf.middleware);

app.use(authRouter);
app.use(linksRouter);
app.use(usersRouter);

app.use("*", (_req, res) => res.status(404).render("not-found"));

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
