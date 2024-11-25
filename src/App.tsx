import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import NuevaCita from './pages/NuevaCita.tsx';
import Layout from './components/Header.tsx';
import VerCitasMedicas from './pages/VerCitasMedicas.tsx';
import VerAgendaDiariaMedica from './pages/VerAgendaDiariaMedica.tsx';
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/Registro.tsx';

const role = localStorage.getItem("role");
function App() {
    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<LoginPage />} />
                    {role === "user" && <Route path="/home" element={<Home />} />}
                    {role === "user" && <Route path="/nueva-cita" element={<NuevaCita />} />}
                    {role === "user" && <Route path="/ver-citas" element={<VerCitasMedicas />} />}
                    {role === "doc" && <Route path="/ver-agenda-diaria" element={<VerAgendaDiariaMedica />} />}
                    <Route path="*" element={<LoginPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
export default App;
