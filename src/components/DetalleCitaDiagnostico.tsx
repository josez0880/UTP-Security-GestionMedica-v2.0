/*
  Componente DetalleCitaDiagnostico:
  
  Propósito:
  - Muestra y permite editar el diagnóstico de una cita médica
  - Interfaz modal para visualizar/editar detalles
  
  Características principales:
  - Dialog modal de Material-UI 
  - Campos para diagnóstico y observaciones
  - Indicador visual del estado de la cita
  - Funcionalidad de guardado
  
  Estados:
  - PROGRAMADA: Cita pendiente
  - COMPLETADA: Cita finalizada con diagnóstico
  - CANCELADA: Cita cancelada
  
  Estructura:
  - StyledDialog: Dialog personalizado con estilos
  - StatusChip: Chip indicador de estado
  - Campos de texto para diagnóstico
  - Botones de acción
  
  Integración:
  - Usa tema personalizado de MUI
  - Manejo de fechas con date-fns
  - Notificaciones con Snackbar
  - Iconos de Material-UI
  
  Validaciones:
  - Campos requeridos antes de guardar
  - Permisos según estado de cita
  - Formato de fecha localizado
*/

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Typography,
  Box,
  Chip,
  ThemeProvider,
  createTheme,
  styled,
  Alert,
  Snackbar
} from '@mui/material';
import { Save as SaveIcon, CheckCircle as CheckCircleIcon } from '@mui/icons-material';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

// Tema personalizado para el componente
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul para estado PROGRAMADA
    },
    secondary: {
      main: '#4caf50', // Verde para estado COMPLETADA
    },
    error: {
      main: '#f44336', // Rojo para estado CANCELADA
    },
  },
});

// Dialog estilizado con espaciado personalizado
const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(3),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(2),
  },
}));

// Props para el chip de estado
interface StatusChipProps {
  status: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';
}

// Chip estilizado que cambia de color según el estado
const StatusChip = styled(Chip)<StatusChipProps>(({ theme, status }) => ({
  backgroundColor: 
    status === 'PROGRAMADA' 
      ? theme.palette.primary.main 
      : status === 'COMPLETADA'
      ? theme.palette.secondary.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
}));

// Props del componente principal
interface DetalleCitaDiagnosticoProps {
  open: boolean;
  onClose: () => void;
  onCompletarCita: (id: number, diagnostico: string, recomendaciones: string) => void;
  cita: {
    id: number;
    patientName: string;
    date: Date;
    specialty: string;
    status: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';
    diagnostico?: string;
    recomendaciones?: string;
  };
}

// Componente principal para mostrar y editar diagnósticos de citas
export default function DetalleCitaDiagnostico({ open, onClose, onCompletarCita, cita }: DetalleCitaDiagnosticoProps) {
  // Estados para manejar el formulario
  const [diagnostico, setDiagnostico] = useState('');
  const [recomendaciones, setRecomendaciones] = useState('');
  const [guardadoProvisional, setGuardadoProvisional] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  // Efecto para cargar datos cuando cambia la cita
  useEffect(() => {
    if (cita.status === 'COMPLETADA') {
      setDiagnostico(cita.diagnostico || '');
      setRecomendaciones(cita.recomendaciones || '');
    } else {
    setDiagnostico('');
    setRecomendaciones('');
    }
    setGuardadoProvisional(false);
  }, [cita]);

  // Manejador para guardar provisionalmente el diagnóstico
  const handleGuardarProvisional = () => {
    // Aquí iría la lógica para guardar provisionalmente
    setGuardadoProvisional(true);
    setSnackbarMessage('Diagnóstico guardado provisionalmente');
    setSnackbarOpen(true);
  };

  // Manejador para guardar definitivamente y completar la cita
  const handleGuardarDefinitivo = () => {
    if (diagnostico.trim() === '') {
      setSnackbarMessage('El diagnóstico es obligatorio');
      setSnackbarOpen(true);
      return;
    }
    onCompletarCita(cita.id, diagnostico, recomendaciones);
    setSnackbarMessage('Diagnóstico guardado definitivamente y cita marcada como completada');
    setSnackbarOpen(true);
    setTimeout(() => {
      onClose();
    }, 1000);
  };

  // Manejador para cerrar el diálogo con confirmación si hay cambios
  const handleClose = () => {
    if (guardadoProvisional && cita.status === 'PROGRAMADA') {
      if (window.confirm('Hay cambios guardados provisionalmente. ¿Está seguro de que desea salir?')) {
        onClose();
      }
    } else {
      onClose();
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <StyledDialog
        open={open}
        onClose={handleClose}
        fullScreen
        aria-labelledby="detalle-cita-diagnostico-titulo"
      >
        <DialogTitle id="detalle-cita-diagnostico-titulo">
          Detalle de Cita y Diagnóstico
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Información de la Cita
            </Typography>
            <Typography><strong>Paciente:</strong> {cita.patientName}</Typography>
            <Typography><strong>Fecha:</strong> {format(cita.date, "d 'de' MMMM 'de' yyyy 'a las' HH:mm", { locale: es })}</Typography>
            <Typography><strong>Especialidad:</strong> {cita.specialty}</Typography>
            <Box sx={{ mt: 1 }}>
              <StatusChip label={cita.status} status={cita.status} />
            </Box>
          </Box>
          <TextField
            fullWidth
            label="Diagnóstico"
            multiline
            rows={4}
            value={diagnostico}
            onChange={(e) => setDiagnostico(e.target.value)}
            required
            error={cita.status === 'PROGRAMADA' && diagnostico.trim() === ''}
            helperText={cita.status === 'PROGRAMADA' && diagnostico.trim() === '' ? 'El diagnóstico es obligatorio' : ''}
            sx={{ mb: 2 }}
            disabled={cita.status !== 'PROGRAMADA'}
          />
          <TextField
            fullWidth
            label="Recomendaciones"
            multiline
            rows={4}
            value={recomendaciones}
            onChange={(e) => setRecomendaciones(e.target.value)}
            sx={{ mb: 2 }}
            disabled={cita.status !== 'PROGRAMADA'}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="inherit">
            Cerrar
          </Button>
          {cita.status === 'PROGRAMADA' && (
            <>
          <Button
            onClick={handleGuardarProvisional}
            startIcon={<SaveIcon />}
            color="primary"
            variant="outlined"
          >
            Guardar Provisionalmente
          </Button>
          <Button
            onClick={handleGuardarDefinitivo}
            startIcon={<CheckCircleIcon />}
            color="secondary"
            variant="contained"
          >
            Guardar Definitivamente
          </Button>
            </>
          )}
        </DialogActions>
      </StyledDialog>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setSnackbarOpen(false)} severity="info" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </ThemeProvider>
  );
}