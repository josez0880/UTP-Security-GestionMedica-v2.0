/*
  Componente VerAgendaDiariaMedica:
  
  Propósito:
  - Muestra la agenda diaria de citas médicas para los doctores
  - Permite visualizar y gestionar las citas programadas del día
  
  Características principales:
  - Interfaz organizada con Material-UI
  - Filtrado de citas por estado (Programada/Completada/Cancelada)
  - Visualización detallada de cada cita
  - Integración con DetalleCitaDiagnostico para ver/editar diagnósticos
  
  Estados de citas:
  - PROGRAMADA: Citas pendientes (azul)
  - COMPLETADA: Citas finalizadas (verde) 
  - CANCELADA: Citas canceladas (rojo)
  
  Estructura de datos:
  - Usa formato date-fns para manejo de fechas
  - Integración con tema personalizado de MUI
  - Componentes estilizados para consistencia visual
  
  Funcionalidades:
  - Expansión/colapso de detalles por cita
  - Visualización de diagnósticos
  - Interfaz responsive con Grid system
  - Chips indicadores de estado
  
  Integración:
  - Conecta con DetalleCitaDiagnostico.tsx
  - Usa iconos de Material-UI
  - Manejo de estados con useState/useEffect
*/

import { useState, useEffect } from 'react';
import { 
  Container, 
  Typography, 
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  ThemeProvider,
  createTheme,
  styled,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  IconButton
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import DetalleCitaDiagnostico from '../components/DetalleCitaDiagnostico.tsx';

/**
 * Tema personalizado para la aplicación
 */
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2', // Azul para programada
    },
    secondary: {
      main: '#4caf50', // Verde para completada
    },
    error: {
      main: '#f44336', // Rojo para cancelada
    },
    background: {
      default: '#f5f5f5',
    },
  },
  typography: {
    fontFamily: 'Roboto, "Helvetica Neue", Arial, sans-serif',
  },
});

interface StyledCardProps {
  status?: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';
}

/**
 * Componente Card estilizado según el estado de la cita
 */
const StyledCard = styled(Card)<StyledCardProps>(({ theme, status }) => ({
  marginBottom: theme.spacing(2),
  borderLeft: `5px solid ${
    status === 'PROGRAMADA' 
      ? theme.palette.primary.main 
      : status === 'COMPLETADA'
      ? theme.palette.secondary.main
      : theme.palette.error.main
  }`,
}));

interface StatusChipProps {
  status: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';
}

/**
 * Chip estilizado que muestra el estado de la cita
 */
const StatusChip = styled(Chip)<StatusChipProps>(({ theme, status }) => ({
  backgroundColor:
    status === 'PROGRAMADA'
      ? theme.palette.primary.main
      : status === 'COMPLETADA'
      ? theme.palette.secondary.main
      : theme.palette.error.main,
  color: theme.palette.common.white,
}));

// Mock data (replace with actual data fetching logic)
const mockAppointments: Appointment[] = [
  { id: 1, time: '09:00', patientName: 'Juan Pérez', specialty: 'Cardiología', status: 'PROGRAMADA', date: new Date(2023, 5, 15, 9, 0) },
  { id: 2, time: '10:00', patientName: 'María García', specialty: 'Dermatología', status: 'COMPLETADA', date: new Date(2023, 5, 15, 10, 0), diagnostico: 'Dermatitis atópica', recomendaciones: 'Aplicar crema hidratante dos veces al día' },
  { id: 3, time: '11:00', patientName: 'Carlos Rodríguez', specialty: 'Oftalmología', status: 'CANCELADA', date: new Date(2023, 5, 15, 11, 0) },
  { id: 4, time: '12:00', patientName: 'Ana Martínez', specialty: 'Pediatría', status: 'PROGRAMADA', date: new Date(2023, 5, 15, 12, 0) },
  { id: 5, time: '13:00', patientName: 'Luis Sánchez', specialty: 'Traumatología', status: 'COMPLETADA', date: new Date(2023, 5, 15, 13, 0), diagnostico: 'Esguince de tobillo', recomendaciones: 'Reposo y aplicar hielo durante 20 minutos cada 2-3 horas' },
];

interface Appointment {
  id: number;
  time: string;
  patientName: string;
  specialty: string;
  status: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA';
  date: Date;
  diagnostico?: string;
  recomendaciones?: string;
}

/**
 * Componente principal que muestra la agenda diaria médica
 * Permite ver, filtrar y gestionar las citas médicas del día
 */
export default function VerAgendaDiariaMedica() {
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [counts, setCounts] = useState({ PROGRAMADA: 0, COMPLETADA: 0, CANCELADA: 0 });
  const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  useEffect(() => {
    // Simulating data fetching
    setAppointments(mockAppointments);
    updateCounts(mockAppointments);
  }, []);

  /**
   * Actualiza los contadores de citas por estado
   * @param appointments - Array de citas a contar
   */
  const updateCounts = (appointments: Appointment[]) => {
    const newCounts = appointments.reduce((acc: Record<'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA', number>, appointment) => {
      acc[appointment.status]++;  
      return acc;
    }, { PROGRAMADA: 0, COMPLETADA: 0, CANCELADA: 0 });
    setCounts(newCounts);
  };

  /**
   * Agrupa las citas por su estado
   */
  const groupedAppointments = appointments.reduce((acc: Record<'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA', Appointment[]>, appointment) => {
    if (!acc[appointment.status]) {
      acc[appointment.status] = [];
    }
    acc[appointment.status].push(appointment);
    return acc;
  }, { PROGRAMADA: [], COMPLETADA: [], CANCELADA: [] });

  /**
   * Abre el diálogo de detalles de una cita
   * @param appointment - Cita seleccionada para ver detalles
   */
  const handleOpenDetail = (appointment: Appointment) => {
    setSelectedAppointment(appointment);
    setDetailDialogOpen(true);
  };

  /**
   * Cierra el diálogo de detalles
   */
  const handleCloseDetail = () => {
    setDetailDialogOpen(false);
  };

  /**
   * Marca una cita como completada y actualiza su diagnóstico
   * @param id - ID de la cita a completar
   * @param diagnostico - Diagnóstico médico
   * @param recomendaciones - Recomendaciones médicas
   */
  const handleCompletarCita = (id: number, diagnostico: string, recomendaciones: string) => {
    const updatedAppointments = appointments.map(appointment =>
      appointment.id === id ? { ...appointment, status: 'COMPLETADA' as 'COMPLETADA', diagnostico, recomendaciones } : appointment
    );
    setAppointments(updatedAppointments as Appointment[]);
    updateCounts(updatedAppointments as Appointment[]);
  };

  /**
   * Renderiza las citas según su estado
   * @param statusAppointments - Array de citas filtradas por estado
   * @param status - Estado de las citas a renderizar
   */
  const renderAppointments = (statusAppointments: Appointment[], status: 'PROGRAMADA' | 'COMPLETADA' | 'CANCELADA') => (
    statusAppointments.length > 0 ? (
      statusAppointments.map((appointment) => (
        <StyledCard key={appointment.id} status={appointment.status}>
                  <CardContent>
            <Grid container spacing={2} alignItems="center">
              <Grid item xs={12} sm={4}>
                <Typography variant="h6">{appointment.time}</Typography>
                <Typography variant="body2" color="textSecondary">
                  Duración: 20 minutos
                    </Typography>
              </Grid>
              <Grid item xs={12} sm={7}>
                <Typography variant="subtitle1">{appointment.patientName}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {appointment.specialty}
                </Typography>
                <Box sx={{ mt: 1 }}>
                  <StatusChip label={appointment.status} status={appointment.status} size="small" />
                </Box>
            </Grid>
              <Grid item xs={12} sm={1}>
                <IconButton
                  aria-label="Ver detalles"
                  onClick={() => handleOpenDetail(appointment)}
                >
                  <VisibilityIcon />
                </IconButton>
            </Grid>
          </Grid>
          </CardContent>
        </StyledCard>
      ))
    ) : (
      <Typography variant="body1" color="textSecondary">
        No hay citas {status.toLowerCase()}s para hoy.
      </Typography>
    )
    );

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
            Agenda Médica
          </Typography>
        <Typography variant="h6" gutterBottom>
          {format(new Date(), "EEEE, d 'de' MMMM 'de' yyyy", { locale: es })}
        </Typography>
        <Box sx={{ mb: 4 }}>
          <Grid container spacing={2}>
            <Grid item>
              <Chip label={`Programadas: ${counts.PROGRAMADA}`} color="primary" />
            </Grid>
            <Grid item>
              <Chip label={`Completadas: ${counts.COMPLETADA}`} color="secondary" />
            </Grid>
            <Grid item>
              <Chip label={`Canceladas: ${counts.CANCELADA}`} color="error" />
            </Grid>
          </Grid>
        </Box>

        <Box sx={{ mb: 4 }}>
          <Typography variant="h6" gutterBottom>
            Citas Programadas
            </Typography>
          {renderAppointments(groupedAppointments['PROGRAMADA'] || [], 'PROGRAMADA')}
        </Box>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
                >
            <Typography>Citas Completadas ({counts.COMPLETADA})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderAppointments(groupedAppointments['COMPLETADA'] || [], 'COMPLETADA')}
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2a-content"
            id="panel2a-header"
      >
            <Typography>Citas Canceladas ({counts.CANCELADA})</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {renderAppointments(groupedAppointments['CANCELADA'] || [], 'CANCELADA')}
          </AccordionDetails>
        </Accordion>

        {selectedAppointment && (
          <DetalleCitaDiagnostico
            open={detailDialogOpen}
            onClose={handleCloseDetail}
            onCompletarCita={handleCompletarCita}
            cita={selectedAppointment}
      />
        )}
    </Container>
    </ThemeProvider>
  );
}