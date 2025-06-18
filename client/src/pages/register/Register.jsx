import React, { useState } from "react";
import "./Register.scss";
import { Link } from "react-router-dom";
import axios from "axios";

const Register = () => {
  const [inputs, setInputs] = useState({
    username: "",
    email: "",
    password: "",
    name: "",
  });
  const [err, setErr] = useState(null);
  const [success, setSuccess] = useState(null); // New state for success message

  const handleChange = (e) => {
    setInputs((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleClick = async (e) => {
    e.preventDefault();
    setErr(null); // Clear previous errors
    setSuccess(null); // Clear previous success messages

    try {
      await axios.post("http://localhost:8800/api/auth/register", inputs);
      setSuccess("Account created successfully! You can now login."); // Set success message
    } catch (err) {
      setErr(err.response?.data || "Something went wrong."); // Set error message
    }
  };

  return (
    <div className="register">
      <div className="card">
        <div className="left">
          <h1>Welcome to Junno!</h1>
          <p>
            Connect with friends, share moments, and explore the world through your social network.
            Junno brings people closer, one post at a time.
          </p>

          <span>Do you have an account?</span>
          <Link to="/login">
            <button>Login</button>
          </Link>
        </div>
        <div className="right">
          <h1>Register</h1>
          <form>
            <input
              type="text"
              placeholder="Username"
              name="username"
              onChange={handleChange}
            />
            <input
              type="email"
              placeholder="Email"
              name="email"
              onChange={handleChange}
            />
            <input
              type="password"
              placeholder="Password"
              name="password"
              onChange={handleChange}
            />
            <input
              type="text"
              placeholder="Name"
              name="name"
              onChange={handleChange}
            />

            {/* Display error or success message */}
            {err && <p className="error">{err}</p>}
            {success && <p className="success">{success}</p>}

            <button onClick={handleClick}>Register</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Register;






