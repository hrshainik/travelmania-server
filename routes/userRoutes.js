const express = require("express");
const userController = require("../controllers/userControllers");
const authController = require("../controllers/authControllers");

const router = express.Router();

router.post("/signup", authController.singup);
router.post("/login", authController.login);

router
  .route("/")
  .get(userController.getAllUsers)
  .post(userController.createUser);

router
  .route("/:id")
  .get(userController.getUser)
  .patch(userController.updateUser)
  .delete(userController.deleteUser);

module.exports = router;
