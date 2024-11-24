import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import NuevaCita from './pages/NuevaCita.tsx';
import Layout from './components/Header.tsx';
import VerCitasMedicas from './pages/VerCitasMedicas.tsx';
import VerAgendaDiariaMedica from './pages/VerAgendaDiariaMedica.tsx';
function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<Home />} />
                    <Route path="/nueva-cita" element={<NuevaCita />} />
                    <Route path="/ver-citas" element={<VerCitasMedicas />} />
                    <Route path="/ver-agenda-diaria" element={<VerAgendaDiariaMedica />} />
                </Route>
            </Routes>
        </Router>
    );
}
export default App;
