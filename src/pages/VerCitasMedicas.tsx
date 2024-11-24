/*
  Componente VerCitasMedicas:

  Propósito:
  - Permite a los pacientes ver y gestionar sus citas médicas programadas
  - Ofrece funcionalidad de filtrado y cancelación de citas

  Características principales:
  - Lista de citas con información detallada
  - Filtros por fecha y estado
  - Funcionalidad para cancelar citas
  - Interfaz responsiva con Material-UI

  Estados de citas:
  - activa: Citas pendientes por atender
  - completada: Citas ya realizadas
  - cancelada: Citas canceladas por el paciente

  Estructura de datos:
  - Interface Cita con: id, fecha, especialidad, médico y estado
  - Mock data temporal para desarrollo
  - Preparado para integración con API real

  Funcionalidades:
  - Carga asíncrona de citas
  - Diálogo de confirmación para cancelaciones
  - Sistema de notificaciones con Snackbar
  - Validaciones de tiempo para cancelaciones

  Integración:
  - Usa componentes de Material-UI
  - Manejo de fechas con date-fns
  - Sistema de estados con useState/useEffect
  - Preparado para autenticación de usuario
*/

// Importaciones necesarias para el funcionamiento del componente
import { useState, useEffect } from 'react';
import { 
  Container, Typography, Grid, Card, CardContent, TextField, 
  Button, CircularProgress, Alert, Chip, Box, Dialog, DialogTitle, DialogContent, DialogActions, Snackbar
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { differenceInHours } from 'date-fns';
import { AlertColor } from '@mui/material';

// Datos de prueba que simulan citas médicas
// En producción estos datos vendrían de una API
const mockCitas = [
  { id: 1, fecha: new Date('2024-11-5'), especialidad: 'Cardiología', medico: 'Dr. Juan Pérez', estado: 'activa' },
  { id: 2, fecha: new Date('2024-03-05'), especialidad: 'Dermatología', medico: 'Dra. Ana García', estado: 'completada' },
  { id: 3, fecha: new Date('2024-03-10'), especialidad: 'Pediatría', medico: 'Dr. Carlos Rodríguez', estado: 'cancelada' },
];

// Interfaz que define la estructura de datos de una cita médica
interface Cita {
  id: number;
  fecha: Date;
  especialidad: string;
  medico: string;
  estado: string;
}

export default function VerCitasMedicas() {
  // Estado para almacenar el listado de citas
  const [citas, setCitas] = useState<Cita[]>([]);
  // Estado para manejar la carga inicial de datos
  const [loading, setLoading] = useState(true);
  // Estado para manejar errores en la carga de datos
  const [error, ] = useState(null);
  // Estados para los filtros de búsqueda
  const [filtroFecha, setFiltroFecha] = useState<Date | null>(null);
  const [filtroEstado, setFiltroEstado] = useState('');
  // Estados para el manejo del diálogo de cancelación
  const [openCancelDialog, setOpenCancelDialog] = useState(false);
  const [selectedCita, setSelectedCita] = useState<Cita | null>(null);
  const [cancelLoading, setCancelLoading] = useState(false);
  // Estado para las notificaciones del sistema
  const [snackbar, setSnackbar] = useState<{ open: boolean; message: string; severity: AlertColor }>({ 
    open: false, 
    message: '', 
    severity: 'info' 
  });

  // Efecto para cargar los datos iniciales
  useEffect(() => {
    // Simulación de llamada a API
    setTimeout(() => {
      setCitas(mockCitas);
      setLoading(false);
    }, 1000);
  }, []);

  // Función para filtrar las citas según los criterios seleccionados
  const citasFiltradas = citas.filter(cita => 
    (!filtroFecha || new Date(cita.fecha).toDateString() === filtroFecha.toDateString()) &&
    (!filtroEstado || cita.estado === filtroEstado)
  );

  // Función para resetear los filtros de búsqueda
  const limpiarFiltros = () => {
    setFiltroFecha(null);
    setFiltroEstado('');
  };

  // Función que verifica si una cita puede ser cancelada
  // Solo se permite cancelar citas activas con más de 24 horas de anticipación
  const isCancelable = (cita: Cita): boolean => {
    return cita.estado === 'activa' && differenceInHours(cita.fecha, new Date()) > 24;
  };

  // Manejador para iniciar el proceso de cancelación
  const handleCancelClick = (cita: Cita) => {
    setSelectedCita(cita);
    setOpenCancelDialog(true);
  };

  // Manejador para confirmar la cancelación de una cita
  const handleCancelConfirm = async () => {
    setCancelLoading(true);
    // Simulación de proceso de cancelación en el backend
    await new Promise(resolve => setTimeout(resolve, 2000));
    setCancelLoading(false);
    setOpenCancelDialog(false);
    // Actualización del estado local de la cita
    setCitas(prevCitas =>
      prevCitas.map(c => (selectedCita && c.id === selectedCita.id) ? {...c, estado: 'cancelada'} : c)
    );
    setSnackbar({ open: true, message: 'Cita cancelada con éxito', severity: 'success' });
  };

  // Manejador para cerrar las notificaciones
  const handleSnackbarClose = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  // Renderizado condicional para estado de carga
  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  // Renderizado condicional para estado de error
  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Mis Citas Médicas
        </Typography>

        <Grid container spacing={3} sx={{ mb: 3 }}>
          <Grid item xs={12} sm={4}>
            <DatePicker
              label="Filtrar por fecha"
              value={filtroFecha}
              onChange={(newValue) => setFiltroFecha(newValue)}
              slotProps={{ 
                textField: { fullWidth: true }
              }}
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <TextField
              select
              label="Filtrar por estado"
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              fullWidth
              SelectProps={{
                native: true,
              }}
              InputLabelProps={{
                shrink: true
              }}
            >
              <option value="">Todos</option>
              <option value="activa">Activa</option>
              <option value="completada">Completada</option>
              <option value="cancelada">Cancelada</option>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={4}>
            <Button variant="outlined" onClick={limpiarFiltros} fullWidth>
              Limpiar filtros
            </Button>
          </Grid>
        </Grid>

        {citasFiltradas.length === 0 ? (
          <Alert severity="info">No hay citas que coincidan con los filtros seleccionados.</Alert>
        ) : (
          <Grid container spacing={3}>
            {citasFiltradas.map((cita) => (
              <Grid item xs={12} sm={6} md={4} key={cita.id}>
                <Card 
                  sx={{ 
                    height: '100%', 
                    display: 'flex', 
                    flexDirection: 'column',
                    borderLeft: 6,
                    borderColor: 
                      cita.estado === 'activa' ? 'primary.main' : 
                      cita.estado === 'completada' ? 'success.main' : 'error.main'
                  }}
                >
                  <CardContent>
                    <Typography variant="h6" component="div">
                      {cita.especialidad}
                    </Typography>
                    <Typography color="text.secondary">
                      {cita.fecha.toLocaleDateString()}
                    </Typography>
                    <Typography variant="body2">
                      {cita.medico}
                    </Typography>
                    <Box sx={{ mt: 2 }}>
                      <Chip 
                        label={cita.estado} 
                        color={
                          cita.estado === 'activa' ? 'primary' : 
                          cita.estado === 'completada' ? 'success' : 'error'
                        }
                        size="small"
                      />
                    </Box>
                    {cita.estado === 'activa' && (
                      <Box sx={{ mt: 2 }}>
                        <Typography variant="body2">
                          Tiempo restante: {differenceInHours(cita.fecha, new Date())} horas
                        </Typography>
                        <Button
                          variant="outlined"
                          color="warning"
                          size="small"
                          onClick={() => handleCancelClick(cita)}
                          disabled={!isCancelable(cita)}
                          sx={{ mt: 1 }}
                        >
                          Cancelar
                        </Button>
                        {!isCancelable(cita) && (
                          <Typography variant="caption" color="error">
                          No cancelable (menos de 12 horas)
                          </Typography>
                        )}
                      </Box>
                    )}
                  </CardContent>
                </Card>
              </Grid>
            ))}
          </Grid>
        )}
        <Dialog open={openCancelDialog} onClose={() => setOpenCancelDialog(false)}>
          <DialogTitle>¿Confirmar cancelación de cita?</DialogTitle>
          <DialogContent>
            {selectedCita && (
              <>
                <Typography>Fecha y hora: {selectedCita.fecha.toLocaleString()}</Typography>
                <Typography>Especialidad: {selectedCita.especialidad}</Typography>
                <Typography>Médico: {selectedCita.medico}</Typography>
                <Typography color="error" sx={{ mt: 2 }}>
                  Advertencia: Las citas solo pueden ser canceladas con al menos 12 horas de anticipación.
                </Typography>
              </>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenCancelDialog(false)} color="inherit">
              Atrás
            </Button>
            <Button onClick={handleCancelConfirm} color="warning" disabled={cancelLoading}>
              {cancelLoading ? <CircularProgress size={24} /> : 'Sí, Cancelar'}
            </Button>
          </DialogActions>
        </Dialog>

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={handleSnackbarClose}
        >
          <Alert onClose={handleSnackbarClose} severity={snackbar.severity} sx={{ width: '100%' }}>
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </LocalizationProvider>
  );
}
