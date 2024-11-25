import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const RegisterPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // Validación básica
      if (!email || !password) {
        setError("Por favor, complete todos los campos");
        return;
      }

      // Validación de formato de email
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(email)) {
        setError("Por favor, ingrese un email válido");
        return;
      }

      // Validación de contraseña
      if (password.length < 6) {
        setError("La contraseña debe tener al menos 6 caracteres");
        return;
      }

      await axios.post("https://ybbqbktuel.execute-api.us-east-1.amazonaws.com/dev/register", {
        body: {
          email,
          password
        }
      });

      alert("Usuario registrado con éxito");
      navigate("/");
    } catch (err: any) {
      setError(err.response?.data?.error || "Error al registrar usuario");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        marginTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 2
      }}>
        <Typography variant="h4" gutterBottom>
          Registro
        </Typography>

        {error && <Alert severity="error">{error}</Alert>}

        <TextField 
          label="Correo" 
          fullWidth 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
          type="email"
        />
        
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
          helperText="La contraseña debe tener al menos 6 caracteres"
        />

        <Button 
          variant="contained" 
          color="primary" 
          onClick={handleRegister}
          fullWidth
          sx={{ mt: 2 }}
        >
          Registrarse
        </Button>
      </Box>
    </Container>
  );
};

export default RegisterPage;