const router = require('express').Router();
const fs = require('fs');
const path = require('path');
const ctrl = require("../controllers");


//users
router.get("/user/:id",ctrl.users.user);
router.get("/users",ctrl.users.userAll);
router.put("/user/update/:id",ctrl.users.updateInfoProfile);
router.put("/user/set/password/:id",ctrl.users.setPassword);
router.put("/user/set/avatar/:id",ctrl.users.setAvatar);
router.post("/user/add/skill/:id", ctrl.users.addSkills);

module.exports = router;