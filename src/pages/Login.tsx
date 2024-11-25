import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await axios.post("http://localhost:4000/api/login", { email, password });
      localStorage.setItem("role", response.data.role);
      if(response.data.role === "user") {
        navigate("/home");
      }
      if(response.data.role === "doc") {
        navigate("/ver-agenda-diaria");
      }
    } catch (err) {
      alert("Error al iniciar sesión." + err);
    }2
  };
const handleRegister = () =>{
    navigate("/register");
}

  return (
    <div>
      <Typography variant="h4">Iniciar Sesión</Typography>
      <TextField label="Correo" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleLogin}>
        Ingresar
      </Button>
      <Button variant="contained" color="primary" onClick={handleRegister}>
        Registrarse
      </Button>
    </div>
  );
};

export default LoginPage;