import React, { useState } from "react";
import { TextField, Button, Typography } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:4000/api/register", { email, password });
      alert("Usuario registrado con éxito.");
      navigate("/");
    } catch (err) {
      alert("Error al registrar usuario.");
    }
  };

  return (
    <div>
      <Typography variant="h4">Registro</Typography>
      <TextField label="Correo" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} />
      <TextField
        label="Contraseña"
        type="password"
        fullWidth
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <Button variant="contained" color="primary" onClick={handleRegister}>
        Registrarse
      </Button>
    </div>
  );
};

export default RegisterPage;