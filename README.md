# JWT-Authentication Important Notes

- Set your port by using .listen method

``` javascript
app.listen(5000, () => {
  console.log("Server is start on http://localhost:5000");
});
```

- One important thing to be note down is 
  we are using JSON as a commumunication mode over API
  To use JSON in our **ExpressJS** we have to use express.json() method it is mandatory
``` javascript
app.use(express.json());
```

- This line of code assure that we can access JSON that is coming from Front-End

- If we want to send some data from backend to frent end we have to use JSON
``` javascript
return res.status(200).json("Any message or any data");
OR
res.status(200).json({
      accessToken,
      userData
    });
```

- To generate token JWT.sign method is used
``` javascript
return jwt.sign({ id: user.id, isAdmin: user.isAdmin }, "hereIsMySecretKey", { expiresIn: "15m" });

Basic Syntax is

jwt.sign(data, secret-key, expiry date)
```

- After reciving data on frontend store it on Local Storage
``` javascript
localStorage.setItem(key:value)

localStorage.setItem("token":"eZ&8*!CjS")
```

- And if we have to send it to our backend we have to send it in our header
``` javascript
    const token = localStorage.getItem("token")
```
``` javascript
{
 headers: {
    Authorization: `Bearer ${token}`,
     },
}
```

- Here is how we get our token in backend

``` javascript
const authHeader = req.headers.authorization;
  console.log(authHeader)
  
  if (!authHeader) {
    return res.status(401).json({ message: "Not Authenticated!" });
  }

  const token = authHeader.split(' ')[1];
  console.log(token)
if (!token) return res.status(401).json({ message: "Not Authenticated!" });
```

- After getting token from front end we need to verify it first. For that we use **JWT.verify** method

``` javascript
jwt.verify(token, "hereIsMySecretKey", async (err, payload) => {
    if (err){
      return res.status(403).json({ message: "Token is not Valid!" });
    } 
    req.userId = payload.id;
    console.log(payload.id)
    next();
  });
```
