import express from "express";
import helmet from "helmet";
import cors from "cors";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { nanoid } from "nanoid";

import { join, dirname } from "node:path";
import { fileURLToPath } from "node:url";
import { Low } from "lowdb";
import { JSONFile } from "lowdb/node";

const app = express();
dotenv.config();

// variables
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

app.get("/locations", async (req, res) => {
  const locations = db.data.locations;
  if (!locations) {
    res.status(404).send({ message: "no locations found" });
  }
  res.status(200).send(locations);
});

app.post("/user/add", async (req, res) => {
  const { username, password } = req.body;
  const users = db.data.users;
  const isUserExist = users.find((user) => user.username === username);

  if (isUserExist) {
    res.status(404).send({ message: "user already exist" });
  }

  const newUser = {
    id: nanoid(),
    username,
    password: bcrypt.hashSync(password, saltRounds),
  };

  await db.data.users.push(newUser);
  await db.write();
  res.status(200).send({ message: "user successfully added" });
});

app.post("/user/login", (req, res) => {
  const { username, password } = req.body;

  const users = db.data.users;
  const user = users.find((user) => user.username === username);

  if (!user) {
    res.status(404).send({ lessage: "user not found" });
  }

  const isPasswordCorrect = bcrypt.compareSync(password, user.password);

  if (!isPasswordCorrect) {
    res.status(404).send({ message: "username or password incorrect" });
  }

  const token = jwt.sign({ username, id: user.id }, JWT_SECRET, {
    expiresIn: "1h",
  });

  const response = {
    token,
    expiresIn: 3600,
    tokenType: "Bearer",
    authUserState: "authenticated",
    message: "User successfully logged in",
    // Add any other additional data you want to send
  };

  // Set the token as an HTTP-only cookie
  res.cookie("token", token, { httpOnly: true });

  res.status(200).send(response);
});

// Middleware pour vérifier le token
export const verifyToken = (req, res, next) => {
  const JWT_SECRET = process.env.JWT_SECRET;
  const token = req.headers.authorization;

  if (!token) {
    res.status(401).send({ message: "Unauthorized" });
    return;
  }

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
