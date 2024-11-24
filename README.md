# React + TypeScript + Vite


### Descripción de los Directorios

---

### **Backend**

El backend contiene el código del servidor y la API. Se encuentra en la carpeta `backend/`.

#### `src/`
El directorio principal del backend, donde se organiza el código fuente:
- **controllers/**: Contiene los controladores, que manejan la lógica asociada a cada endpoint de la API.
- **models/**: Aquí se definen los modelos de datos, ya sea utilizando una base de datos relacional o no relacional.
- **routes/**: Define las rutas o endpoints del backend y su conexión con los controladores.
- **services/**: Servicios reutilizables que encapsulan lógica de negocio específica (por ejemplo, manejo de autenticación, cálculos, etc.).
- **config/**: Archivos de configuración, como la conexión a la base de datos o variables de entorno específicas.
- **index.js**: Punto de entrada del servidor, donde se inicializa la aplicación, se configuran rutas y se levantan servicios.

---

### **Frontend**

El frontend contiene el código de la aplicación React. Se encuentra en la carpeta `frontend/`.

#### `src/`
El directorio principal del frontend, donde se organiza el código fuente:
- **components/**: Componentes reutilizables de la UI (botones, tarjetas, etc.).
- **pages/**: Representan vistas completas (por ejemplo, `Home`, `Login`, `Dashboard`) que se componen de varios componentes.
- **hooks/**: Custom hooks de React que encapsulan lógica reutilizable, como manejo de formularios o estados complejos.
- **services/**: Funciones que interactúan con la API del backend (usando `fetch`, `axios`, etc.).
- **context/**: Archivos para manejar el estado global de la aplicación usando Context API.
- **assets/**: Recursos estáticos como imágenes, fuentes o archivos de estilo global.
- **App.js**: Componente principal donde se configuran las rutas y la estructura base de la aplicación.
- **index.js**: Punto de entrada de React, donde se renderiza la aplicación en el DOM.

#### Otros archivos
- **public/**: Archivos estáticos como el `index.html` base.
- **package.json**: Define las dependencias y scripts del frontend.

---

## Notas Adicionales

1. **Separación de responsabilidades:**
    - El backend está diseñado para manejar la lógica del servidor, la base de datos y la exposición de una API RESTful.
    - El frontend está diseñado para consumir esta API y manejar la interacción con el usuario.

2. **Comunicación entre frontend y backend:**
    - El frontend se conecta al backend a través de endpoints definidos en `app.tsx`.

