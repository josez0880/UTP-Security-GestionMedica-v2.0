import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './pages/Home.tsx';
import NuevaCita from './pages/NuevaCita.tsx';
import Layout from './components/Header.tsx';
import VerCitasMedicas from './pages/VerCitasMedicas.tsx';
import VerAgendaDiariaMedica from './pages/VerAgendaDiariaMedica.tsx';
import LoginPage from './pages/Login.tsx';
import RegisterPage from './pages/Registro.tsx';

function App() {
    const role = localStorage.getItem("role");

    return (
        <Router>
            <Routes>
                <Route element={<Layout />}>
                    <Route path="/" element={<LoginPage />} />
                    <Route path="/register" element={<RegisterPage />} />
                    {role === "user" ? (
                        <>
                            <Route path="/home" element={<Home />} />
                            <Route path="/nueva-cita" element={<NuevaCita />} />
                            <Route path="/ver-citas" element={<VerCitasMedicas />} />
                        </>
                    ) : role === "doc" ? (
                        <Route path="/ver-agenda-diaria" element={<VerAgendaDiariaMedica />} />
                    ) : null}
                    <Route path="*" element={<LoginPage />} />
                </Route>
            </Routes>
        </Router>
    );
}
export default App;
