const User = require("../models/Users");
const bcrypt = require("bcryptjs"); // https://github.com/dcodeIO/bcrypt.js#readme
const jwt = require("jsonwebtoken");
const validator = require("validator");
const jwt_secret = process.env.JWT_SECRET;
// the client is sending this body object
//  {
//     email: form.email,
//     password: form.password,
//     password2: form.password2
//  }
const register = async (req, res) => {
  const { email, password, password2 } = req.body;
  if (!email || !password || !password2) {
    return res.json({ ok: false, message: "All fields required" });
  }
  if (password !== password2) {
    return res.json({ ok: false, message: "Passwords must match" });
  }
  if (!validator.isEmail(email)) {
    return res.json({ ok: false, message: "Invalid email" });
  }
  try {
    const user = await User.findOne({ email });
    if (user) return res.json({ ok: false, message: "User exists!" });

    // Generate a salt
    const salt = bcrypt.genSaltSync(10);
    // Hash the password with the salt
    const hash = bcrypt.hashSync(password, salt);

    const newUser = {
      email,
      password: hash,
    };
    await User.create(newUser);
    res.json({ ok: true, message: "Successfully registered" });
  } catch (error) {
    console.log(error);
    res.json({ ok: false, error });
  }
};
// the client is sending this body object
//  {
//     email: form.email,
//     password: form.password
//  }
const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res.json({ ok: false, message: "All fields are required" });
  }
  if (!validator.isEmail(email)) {
    return res.json({ ok: false, message: "Invalid email provided" });
  }
  try {
    const user = await User.findOne({ email });
    if (!user) return res.json({ ok: false, message: "Invalid user provided" });

    const match = bcrypt.compareSync(password, user.password);
    if (match) {
      const token = jwt.sign({ userEmail: user.email }, jwt_secret, {
        expiresIn: "356d",
      });
      res.json({ ok: true, message: "welcome back", token, email });
    } else return res.json({ ok: false, message: "Invalid data provided" });
  } catch (error) {
    res.json({ ok: false, error });
  }
};

const verify_token = (req, res) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.json({ ok: false, message: "No token provided" });
  }

  const token = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : authHeader;

  jwt.verify(token, jwt_secret, (err, succ) => {
    if (err) {
      return res.json({ ok: false, message: "Token is corrupted" });
    }
    res.json({ ok: true, succ });
  });
};


module.exports = { register, login, verify_token };