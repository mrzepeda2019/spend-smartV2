import express from "express";
import { create } from "express-handlebars";
import { getUserInfo, getTransactions } from "./db/index.js";
import bodyParser from "body-parser";

// Routes
import transactionsRouter from "./routes/transactions.js";

const hbs = create({
  helpers: {
    ifEquals(arg1, arg2, options) {
      return arg1 === arg2 ? options.fn(this) : options.inverse(this);
    },
    isExpense(arg1) {
      return arg1.amount < 0;
    },
    isExpenseClassname(arg1, _options) {
      return arg1.amount < 0 ? "expense" : "income";
    },
  },
});

const app = express();
app.use(bodyParser.json());
app.engine("handlebars", hbs.engine);
app.set("view engine", "handlebars");
app.set("views", "./views");
app.use(express.static("public/"));

app.get("/", (req, res) => {
  const queryParams = req.query;
  const userInfo = getUserInfo();
  res.render("home", {
    ...userInfo,
    transactions: getTransactions(queryParams),
  });
});

app.use("/transactions", transactionsRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Listening on port: ${port}`);
});
