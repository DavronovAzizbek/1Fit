import { UserController } from "src/controllers/user.Controller";
import { verifyToken } from "src/middlewares/verifyToken";
import { Router } from "express";
import passport from "passport";
import GymController from "src/controllers/gym.Controller";
import SportController from "src/controllers/sport.Controller";
import { VerifyRole } from "src/middlewares/verifyRole";

let router: Router = Router();

// GitHub Login
router.get("/auth/github", UserController.LoginGithub);
router.get(
  "/auth/callback",
  passport.authenticate("github", { failureRedirect: "/login" }),
  UserController.CallbackGithub
);


router.get("/users", UserController.getAllGithub);

// Admin Routes
router.post("/admin/create", UserController.Admin);
router.post("/admin/login", UserController.adminLogin);

//  Get Me Route
router.get("/me", UserController.getMe);

// Gym
router.get("/gyms/get-all", GymController.getAllGyms);
router.get("/gyms/get-by-id/:id", GymController.getGymById);
router.post("/gyms/create", GymController.createGym);
router.put("/gyms/update/:id", GymController.updateGym);
router.delete("/gyms/delete/:id", GymController.deleteGym);
router.get("/gyms/search", GymController.searchGyms);
router.post("/gyms/add-sport", GymController.addSportToGym);

// Sport
router.get("/sports/get-all", SportController.getAllSports);
router.get("/sports/get-by-id/:id", SportController.getSportById);
router.post("/sports/create", SportController.createSport);
router.put("/sports/update/:id", SportController.updateSport);
router.delete("/sports/delete/:id", SportController.deleteSport);
router.get("/sports/search", SportController.searchSport);

export default router;
