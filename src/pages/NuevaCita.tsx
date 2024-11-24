/*
  Backend y Lógica de Negocio:

  - Integración con AWS Amplify:
    - Se espera integrar con Amazon Cognito para autenticación del paciente
    - Los datos de citas se almacenarán en DynamoDB a través de AppSync
    - Schema GraphQL necesario para manejar las citas médicas

  - Modelo de Datos Principal:
    PK: CITA#{ID}
    SK: PACIENTE#{ID}
    GSI1: Por fecha para búsquedas eficientes
    Atributos: fecha, hora, especialidad, idMedico, estado

  - Validaciones Importantes:
    - Verificar disponibilidad del médico
    - No permitir citas en fechas pasadas
    - Límite de 30 días para agendar
    - Validar horario laboral
    - Evitar duplicidad de citas

  - Flujo de Datos:
    1. Cliente selecciona especialidad -> Query para médicos disponibles
    2. Selecciona fecha -> Query para horarios disponibles
    3. Confirma cita -> Mutation para crear registro
    4. Notificación por SNS/SES al paciente

  - Manejo de Estados:
    - PROGRAMADA
    - CONFIRMADA
    - CANCELADA
    - COMPLETADA

  - Permisos y Seguridad:
    - Solo pacientes autenticados pueden crear citas
    - Restricción de modificación post-confirmación
    - Logs de auditoría en CloudWatch
*/

import  { useState } from 'react';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  MenuItem, 
  Paper,
  Snackbar,
  CircularProgress,
  Step,
  Stepper,
  StepLabel,
  IconButton,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { es } from 'date-fns/locale';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import { addDays, isBefore, isAfter } from 'date-fns';
import { useNavigate } from 'react-router-dom';

// Lista de especialidades médicas disponibles
const especialidades = [
  { value: 'general', label: 'Medicina General' },
  { value: 'cardiologia', label: 'Cardiología' },
  { value: 'dermatologia', label: 'Dermatología' },
  { value: 'pediatria', label: 'Pediatría' },
];

export default function NuevaCita() {
  const [activeStep, setActiveStep] = useState(0);
  const [fecha, setFecha] = useState<Date | null>(null);
  const [especialidad, setEspecialidad] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'info' });
  const navigate = useNavigate();
  const [citaConfirmada, setCitaConfirmada] = useState({
    fecha: null as Date | null,
    hora: '',
    especialidad: '',
    medico: '',
  });

  /**
   * Valida si una fecha es válida para agendar una cita
   * @param date - Fecha a validar
   * @returns boolean - true si la fecha es válida, false si no lo es
   */
  const validarFecha = (date: Date | null): boolean => {
    if (!date) return false;
    const hoy = new Date();
    const minDate = addDays(hoy, 1); // Mínimo un día después
    const maxDate = addDays(hoy, 30); // Máximo 30 días después
    return !isBefore(date, minDate) && !isAfter(date, maxDate);
  };

  /**
   * Busca disponibilidad de citas para la fecha y especialidad seleccionadas
   * Simula una llamada a API con un timeout
   */
  const handleBuscarDisponibilidad = async () => {
    if (!validarFecha(fecha) || !especialidad) {
      setSnackbar({ open: true, message: 'Por favor, seleccione una fecha válida y una especialidad.', severity: 'error' });
      return;
    }

    setLoading(true);
    // Simular una llamada a la API para buscar disponibilidad
    setTimeout(() => {
      // Simulación de respuesta exitosa
      setCitaConfirmada({
        fecha: fecha,
        hora: '10:00',
        especialidad: especialidades.find(e => e.value === especialidad)?.label || '',
        medico: 'Dr. García',
      });
      setActiveStep(1);
      setLoading(false);
    }, 1500);
  };

  /**
   * Confirma la cita médica y envía la información al backend
   * Simula una llamada a API con un timeout
   */
  const handleConfirmarCita = async () => {
    setLoading(true);
    // Simular una llamada a la API para confirmar la cita
    setTimeout(() => {
      setSnackbar({ open: true, message: 'Cita creada exitosamente. Se ha enviado un correo con los detalles.', severity: 'success' });
      setLoading(false);
      // Redirigir al usuario a la página de ver citas
      navigate('/ver-citas');
    }, 1500);
  };

  /**
   * Maneja la navegación hacia atrás en el flujo de creación de cita
   * Si está en el primer paso, vuelve al Home
   * Si está en otro paso, vuelve al paso anterior
   */
  const handleVolver = () => {
    if (activeStep === 0) {
      // Aquí se podría implementar la navegación de vuelta al Home
      console.log('Volver al Home');
    } else {
      setActiveStep(0);
    }
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={es}>
      <Container maxWidth="sm">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Grid container spacing={2} alignItems="center" sx={{ mb: 2 }}>
            <Grid item>
              <IconButton onClick={handleVolver} aria-label="volver">
                <ArrowBackIcon />
              </IconButton>
            </Grid>
            <Grid item xs>
              <Typography variant="h5" component="h1">
                Nueva Cita Médica
          </Typography>
            </Grid>
          </Grid>
          
          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            <Step>
              <StepLabel>Selección</StepLabel>
            </Step>
            <Step>
              <StepLabel>Confirmación</StepLabel>
            </Step>
          </Stepper>

          {activeStep === 0 ? (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <DatePicker
                  label="Fecha de la cita"
                  value={fecha}
                  onChange={(newValue) => setFecha(newValue)}
                  slotProps={{ 
                    textField: { fullWidth: true }
                  }}
                  shouldDisableDate={(date) => !validarFecha(date)}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  select
                  label="Especialidad"
                  value={especialidad}
                  onChange={(e) => setEspecialidad(e.target.value)}
                  fullWidth
                >
                  {especialidades.map((option) => (
                    <MenuItem key={option.value} value={option.value}>
                      {option.label}
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleBuscarDisponibilidad}
                  disabled={loading || !fecha || !especialidad}
                >
                  {loading ? <CircularProgress size={24} /> : 'Revisar disponibilidad'}
                </Button>
              </Grid>
            </Grid>
          ) : (
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <Typography variant="h6">Resumen de la Cita</Typography>
              </Grid>
              <Grid item xs={12}>
                <Typography>Fecha: {citaConfirmada.fecha?.toLocaleDateString()}</Typography>
                <Typography>Hora: {citaConfirmada.hora}</Typography>
                <Typography>Especialidad: {citaConfirmada.especialidad}</Typography>
                <Typography>Médico: {citaConfirmada.medico}</Typography>
                <Typography sx={{ mt: 2 }}>Duración: 20 minutos</Typography>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="contained"
                  color="primary"
                  fullWidth
                  onClick={handleConfirmarCita}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} /> : 'Confirmar Cita'}
                </Button>
              </Grid>
              <Grid item xs={12}>
                <Button
                  variant="outlined"
                  color="secondary"
                  fullWidth
                  onClick={() => setActiveStep(0)}
                >
                  Cancelar
                </Button>
              </Grid>
            </Grid>
          )}
        </Paper>
      </Container>
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        message={snackbar.message}
      />
    </LocalizationProvider>
  );
}