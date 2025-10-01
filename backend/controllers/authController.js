const pool = require("../db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
  const { name, email, password, role } = req.body;

  try {
    const userExists = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    // ✅ check if this is the first user
    const userCount = await pool.query("SELECT COUNT(*) FROM users");
    const assignedRole = userCount.rows[0].count === "0" ? "admin" : (role || "student");

    const newUser = await pool.query(
      "INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING user_id, name, email, role",
      [name, email, hashedPassword, assignedRole]
    );

    res.status(201).json(newUser.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await pool.query("SELECT * FROM users WHERE email = $1", [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.rows[0].password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign(
      { user_id: user.rows[0].user_id, role: user.rows[0].role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.json({
      token,
      user: {
        id: user.rows[0].user_id,
        name: user.rows[0].name,
        role: user.rows[0].role,
      },
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
