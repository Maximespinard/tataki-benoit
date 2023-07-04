// import dependencies
import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

// import path and url modules
import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";

// configure dotenv to use .env file
dotenv.config();

// variables
const app = express();
const PORT = process.env.PORT || 3000;
const JWT_SECRET = process.env.JWT_SECRET;
const saltRounds = 10;

// middlewares
app.use(express.json());
app.use(helmet());
app.use(cors());

// db.json file path
const __dirname = dirname(fileURLToPath(import.meta.url));
const file = join(__dirname, "db.json");

// Configure lowdb to write data to JSON file
const adapter = new JSONFile(file);
const defaultData = { locations: [] };
const db = new Low(adapter, defaultData);

// To read data from JSON file
await db.read();

// Route to get all locations
app.get("/locations", async (req, res) => {
  // get all locations from db
  const locations = db.data.locations;
  // if no locations found return 404
  if (!locations) {
    res.status(404).send({ message: "no locations found" });
  }
  // return all locations
  res.status(200).send({ locations });
});

// Route to add a user
app.post("/user/add", async (req, res) => {
  // get username and password from request body
  const { username, password } = req.body;
  // get all users from db
  const users = db.data.users;
  // check if user already exist
  const isUserExist = users.find((user) => user.username === username);

  // if user already exist return 404
  if (isUserExist) {
    res.status(404).send({ message: "user already exist" });
  }

  // create new user object
  const newUser = {
    id: nanoid(),
    username,
    password: bcrypt.hashSync(password, saltRounds),
  };

  // add new user to db
  await db.data.users.push(newUser);
  // write data to JSON file
  await db.write();
  // return success message
  res.status(200).send({ message: "user successfully added" });
});

// Route to login a user
app.post("/user/login", (req, res) => {
  // get username and password from request body
  const { username, password } = req.body;

  // get all users from db
  const users = db.data.users;
  // check if user exist
  const user = users.find((user) => user.username === username);

  // if user not found return 404
  if (!user) {
    res.status(404).send({ lessage: "user not found" });
  }

  // check if password is correct
  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  // if password is incorrect return 404
  if (!isPasswordCorrect) {
    res.status(404).send({ message: "username or password incorrect" });
  }

  // create token
  const token = jwt.sign({ username, id: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  // create response object
  const response = {
    token,
    expiresIn: 3600,
    tokenType: "Bearer",
    authUserState: "authenticated",
    message: "User successfully logged in",
  };

  // Set the token as an HTTP-only cookie
  res.cookie("token", token, { httpOnly: true });
  // return response
  res.status(200).send(response);
});

// Middleware pour vérifier le token
export const verifyToken = (req, res, next) => {
  // Récupère le token dans le header de la requête et le secret dans les variables d'environnement
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

  // Vérifie le token
  jwt.verify(token, JWT_SECRET, (err, decoded) => {
    if (err) {
      console.log(err);
      res.status(401).send({ message: "Unauthorized" });
      return;
    }

    // Ajoute les informations décodées dans l'objet req pour une utilisation ultérieure
    req.user = decoded;
    next();
  });
};

// Route pour verifier si l'utilisateur est connecté
app.get("/user/me", verifyToken, (req, res) => {
  // La vérification du token a réussi, vous pouvez accéder aux informations de l'utilisateur via req.user
  res.status(200).send(req.user);
});

/* app.post("/locations/add", async (req, res) => {
  const post = {
    id: nanoid(),
    name: req.body.name,
  };
  await db.data.data.push(post);
  await db.write();
  res.send(post);
});

app.delete("/data/delete/:id", async (req, res) => {
  const id = req.params.id;
  await db.data.data.splice(id, 1);
  await db.write();
  res.send(id);
}); */

app.listen(PORT, () => {
  console.log(`app running on port ${PORT}`);
});
