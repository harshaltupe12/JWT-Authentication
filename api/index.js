const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");

app.use(express.json()); //This is main function is use to get data from frontend

const users = [
  {
    id: "1",
    username: "john",
    password: "John0908",
    isAdmin: true,
  },
  {
    id: "2",
    username: "jane",
    password: "Jane0908",
    isAdmin: false,
  },
];

const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "hereIsMySecretKey", {
    expiresIn: "15m",
  });
};

const generateRefreshToken = (user) => {
  return jwt.sign(
    { id: user.id, isAdmin: user.isAdmin },
    "hereIsMyRefreshSecretKey"
  );
};

let refreshTokens = [];

app.post("/api/refresh", (req, res) => {
  // Take the refresh token form user
  const refreshToken = req.body.token;

  // Send the error if there is no token or invalid
  if (!refreshToken) {
    return res.status(401).json("You are not authenticated");
  }
  if (!refreshTokens.include(refreshToken)) {
    return res.status(403).json("refresh token is not valid");
  }

  jwt.verify(refreshToken, "hereIsMyRefreshSecretKey", (err, user) => {
    err && console.log(err);
    refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
    const newAccessToken = generateAccessToken(user);
    const newRefreshToken = generateRefreshToken(user);
    refreshTokens.push(newRefreshToken);

    res.status(200).json({
      accessToken: newAccessToken,
      refreshToken: newRefreshToken,
    });
  });

  // If everything okay then create new token, refresh token and send to user
});

app.post("/api/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => {
    return u.username == username && u.password == password;
  });

  if (user) {
    const accessToken = generateAccessToken(user);
    const refreshToken = generateRefreshToken(user);
    refreshTokens.push(refreshToken);
    res.json({ user, accessToken, refreshToken });
  } else {
    res.status(400).json("Username and password not fond!!");
  }
});



const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    console.log(token);

    jwt.verify(token, "hereIsMySecretKey", (err, user) => {
      if (err) {
        res.status(403).json("Your token is not Valid");
      }
      req.user = user;
      next();
    });
  } else {
    res.status(401).json("You are not authenticated");
  }
};

app.post("/api/logout", verifyToken, (req, res) => {
  const refreshToken = req.body.token;
  refreshTokens = refreshTokens.filter((token) => token !== refreshToken);
  res.status(200).json("You logged out successfully.");
});

app.delete("/api/users/:userId", verifyToken, (req, res) => {
  if (req.user.id === req.params.userId || req.user.isAdmin) {
    res.status(200).json("User Has been deleted");
  } else {
    res.status(403).json("You are not allow to delete this user");
  }
});

app.listen(5000, () => {
  console.log("Server is start on http://localhost:5000");
});
