const express = require("express");
const route = express.Router();

const services = require("../services/render");
const controller = require("../controller/controller");

//Signup
route.get("/signup", services.signUser);
route.post("/signup", controller.create);

// showing login page
route.get("/", services.homeRoutes);
route.get("/login", services.homeRoutes);
route.post("/user_login", services.user_login);

route.get("/dashboard_user", services.dashboard_user);

route.get("/logout", services.logout);

// ................................Admin Side......................................................

route.get("/admin_login", services.admin_login);
route.post("/admin_login", services.verify_admin_login);

route.get("/add-user", services.add_user);
route.post("/add-user", services.adding_user);

route.get("/update-user", services.update_user);

route.get("/user_details", services.user_details);

route.get("/logoutadmin", services.adminLogout);

route.get("/delete-user", controller.delete);

//API
route.post("/api/users", controller.create);
route.get("/api/users", controller.find);
route.put("/api/users/:id", controller.update);
// route.delete('/api/users/:id',controller.delete)

module.exports = route;
