const express = require("express");
const cookieParser = require("cookie-parser");
const cors = require("cors");

const app = express();

const linksRouter = require("./routes/linksRoutes");
const usersRouter = require("./routes/usersRoutes");
const authRouter = require("./routes/authRoutes");

app.use(cors());
app.use(cookieParser(process.env.COOKIE_SECRET));
app.use(express.json());

app.use("/api/auth", authRouter);
app.use("/api/links", linksRouter);
app.use("/api/users", usersRouter);

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
