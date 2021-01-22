import express from "express";
import * as path from "path";
import hbs from "express-handlebars";
import cookieParser from "cookie-parser";
import customers from "./customers.mjs";


const rootDir = process.cwd();
const port = 3000;
const app = express();

app.use('/static', express.static('static'))
app.use(cookieParser())
// Выбираем в качестве движка шаблонов Handlebars
app.set("view engine", "hbs");
// Настраиваем пути и дефолтный view
app.engine(
  "hbs",
  hbs({
    extname: "hbs",
    defaultView: "default",
    layoutsDir: path.join(rootDir, "/views/layouts/"),
    partialsDir: path.join(rootDir, "/views/partials/"),
  })
);

app.get("/", (_, res) => {
  //res.sendFile(path.join(rootDir, "/static/html/index.html"));
  res.redirect('/menu');
});

app.get("/menu", (_, res) => {
  res.render("menu", {
    layout: "default",
    items: [
      {
        name: "Americano",
        image: "/static/img/americano.jpg",
        price: 999,
      },
      { name: "Cappuccino", image: "/static/img/cappuccino.jpg", price: 999 },
      { name: "Espresso", image: "/static/img/espresso.jpg", price: 999 },
      { name: "Flat-white", image: "/static/img/flat-white.jpg", price: 999 },
      { name: "Latte", image: "/static/img/latte.jpg", price: 999 },
    ],
    title: "menu",
  });
});

app.get("/buy/:name", (req, res) => {
  if (customers[req.cookies.username])
    customers[req.cookies.username].totalPrice += 999;
  res.redirect('/menu');
});

app.get("/cart", (req, res) => {
  let tP = customers[req.cookies.username] ? customers[req.cookies.username].totalPrice : 0;
  res.render("cart", {
    layout: "default",
    totalPrice: tP + ' руб',
    title: "cart",
  });
});

app.post("/cart", (req, res) => {
  if (customers[req.cookies.username])
    customers[req.cookies.username].totalPrice = 0;
  res.redirect('/cart')
});

app.post("/cart/:buy", (req, res) => {
  res.send(req.params);
});

app.get("/login", (req, res) => {
  let valueName;
  if (req.query.username) {
    res.cookie('username', req.query.username);
    valueName = req.query.username;
    customers.add(req.query.username);
  }
  else if (customers[req.cookies.username]) {
    valueName = customers[req.cookies.username].username;
  }
  else
    valueName = 'введи свое имя';

  res.render("login", {
    layout: "default",
    username: `${valueName}`,
    title: "login",
  });
});




app.listen(port, () => console.log(`App listening on port ${port}`));