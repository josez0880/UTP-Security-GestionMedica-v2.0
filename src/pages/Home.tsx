/*
    Este archivo representa la página principal (Home) del Sistema de Gestión de Citas Médicas.

    De accaso solo para pacientes
    Componentes principales:
    - Utiliza Material-UI para los elementos de interfaz
    - Implementa un diseño responsivo con Grid
    - Incluye botones de navegación a otras secciones

    Funcionalidad:
    - Botón para crear nueva cita médica (/nueva-cita)
    - Botón para ver citas existentes (/ver-citas)
    - Diseño centrado con animaciones hover en los botones

    Estructura:
    - Container: Contenedor principal con ancho máximo "sm"
    - Paper: Tarjeta elevada que contiene todo el contenido
    - Typography: Títulos y textos descriptivos
    - Grid: Sistema de rejilla para organizar los botones
    - Box: Contenedor para los enlaces de navegación
    - Button: Botones interactivos con iconos

    Estilos:
    - Usa sistema de espaciado de MUI (mt: margin-top, p: padding)
    - Animaciones de escala en hover
    - Colores temáticos de Material-UI
*/
import { 
  Button, 
  Container, 
  Grid, 
  Typography, 
  Box,
  Paper
} from '@mui/material';
import { Add as AddIcon, CalendarMonth as CalendarIcon } from '@mui/icons-material';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <Container maxWidth="sm" sx={{ mt: 4 }}>
      <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
            Sistema de Gestión de Citas Médicas de userName
        </Typography>
        <Grid container spacing={4} sx={{ mt: 2 }}>
          <Grid item xs={12} sm={6}>
            <Box 
              component={Link}
              to="/nueva-cita"
              sx={{ textDecoration: 'none' }}
            >
              <Button
              variant="contained"
                color="primary"
              size="large"
              startIcon={<AddIcon />}
              fullWidth
                sx={{ 
                  height: '100px',
                  flexDirection: 'column',
                  '&:hover': { transform: 'scale(1.05)' },
                  transition: 'transform 0.3s'
                }}
              >
                <Typography variant="subtitle1">Crear Nueva Cita</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Agende su próxima consulta
                </Typography>
            </Button>
            </Box>
          </Grid>
          <Grid item xs={12} sm={6}>
            <Box 
              component={Link} 
              to="/ver-citas" 
              sx={{ textDecoration: 'none' }}
            >
              <Button
                variant="contained"
                color="secondary"
                size="large"
                startIcon={<CalendarIcon />}
                fullWidth
                sx={{ 
                  height: '100px',
                  flexDirection: 'column',
                  '&:hover': { transform: 'scale(1.05)' },
                  transition: 'transform 0.3s'
                }}
              >
                <Typography variant="subtitle1">Ver Mis Citas</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>
                  Revise sus citas programadas
                </Typography>
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
      </Container>
  );
}
