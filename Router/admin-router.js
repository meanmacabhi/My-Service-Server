const express = require("express");
const authMiddleware = require ("../Middleware/auth-middleware");
const adminMiddleware = require("../Middleware/admin-middleware")
const {login} = require("../Controllers/Auth-Controllers")
const  {getAllUsers,getAllContacts,deleteUserById,deleteContactById,getUserById,updateUserById,sendResponseToContact} = require("../Controllers/Admin-controllers");
const router = express.Router();

router.route("/contacts/delete/:id").delete(authMiddleware,adminMiddleware,deleteContactById);
router.route("/users/delete/:id").delete(authMiddleware,adminMiddleware,deleteUserById);
router.route("/users/:id").get(authMiddleware,adminMiddleware,getUserById);
router.route("/user/update/:id").patch(authMiddleware,adminMiddleware,updateUserById);
router.route("/users").get(authMiddleware,adminMiddleware,getAllUsers);
router.route("/contacts").get(authMiddleware,adminMiddleware,getAllContacts);
router.route("/contacts/respond/:id").post(authMiddleware, adminMiddleware, sendResponseToContact);

module.exports = router