/*
  Componente Header:
  - Define la estructura de la aplicación con una barra de navegación superior
  - Incluye un logo y un título
  - Utiliza Material-UI para estilizar la barra de navegación
*/
import React from 'react';
import { AppBar, Toolbar, Typography } from '@mui/material';
import { Outlet } from 'react-router-dom';

const Layout: React.FC = () => {
  return (
    <>
      <AppBar position="static" color="primary">
        <Toolbar>
          <img src="../assets/logo.svg" alt="logo" style={{ paddingRight: '1%' }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Clínica Salud Total
          </Typography>
        </Toolbar>
      </AppBar>
      <Outlet />
    </>
  );
};

export default Layout;