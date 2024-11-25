import React, { useState } from "react";
import { TextField, Button, Typography, Container, Box, Alert } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      if (!email || !password) {
        setError("Por favor, complete todos los campos");
        return;
      }

      const response = await axios.post("https://ybbqbktuel.execute-api.us-east-1.amazonaws.com/dev/login", {
        body: {
          email,
          password
        }
      });

      // Parsear el body que viene como string
      const userData = JSON.parse(response.data.body);
      console.log('Datos del usuario:', userData);

      // Guardar datos del usuario
      localStorage.setItem("userId", userData.ID);
      localStorage.setItem("email", userData.email);
      localStorage.setItem("role", userData.role);
      localStorage.setItem("estado", userData.Estado);
      localStorage.setItem("tipo", userData.Tipo);

      // Redirección basada en el rol
      if (userData.role === "user") {
        window.location.href = "/home";
      } else if (userData.role === "doc") {
        window.location.href = "/ver-agenda-diaria";
      }
      
    } catch (err: any) {
      console.error('Error completo:', err);
      setError(err.response?.data?.error || "Error al iniciar sesión");
    }
  };

  const handleRegister = () => {
    navigate("/register");
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
          Iniciar Sesión
        </Typography>
        
        {error && <Alert severity="error">{error}</Alert>}

        <TextField 
          label="Correo" 
          fullWidth 
          value={email} 
          onChange={(e) => setEmail(e.target.value)}
          margin="normal"
        />
        
        <TextField
          label="Contraseña"
          type="password"
          fullWidth
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          margin="normal"
        />

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleLogin}
            fullWidth
          >
            Ingresar
          </Button>
          
          <Button 
            variant="outlined" 
            color="primary" 
            onClick={handleRegister}
            fullWidth
          >
            Registrarse
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default LoginPage;