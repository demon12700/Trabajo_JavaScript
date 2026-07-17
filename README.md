## 🚀 Características

* **Módulo Administrativo y de Control (System):** Permite un seguimiento riguroso de la flota mediante un CRUD completo de vehículos, gestión de usuarios internos y un registro de cambios a Vehiculos especificos (`Cambios`).
* **Portal del Cliente (User):** Espacio personalizado para que los usuarios externos puedan registrarse, iniciar sesión, administrar sus datos personales y consultar el estado actual de sus vehículos (`mis-vehiculos`).
* **Seguridad por Roles (Middlewares):** Implementa un sistema de protección de rutas diferenciado que separa estrictamente los permisos del personal administrativo (`AuthMiddleware`) de los accesos de los clientes (`AuthClienteMiddleware`).
* **Soporte Técnico en Tiempo Real:** Chat bidireccional e instantáneo desarrollado con Socket.io, diseñado tanto para la interacción directa del usuario (`soporte`) como para la gestión centralizada desde un panel de control de operaciones (`soporteDashboard`).
* **Asistente Inteligente con IA (Gemini):** Automatización de respuestas dentro del chat de soporte técnico. El sistema procesa las consultas de forma avanzada conectándose a la API de Gemini, modulando su comportamiento y respuestas según las directivas de negocio configuradas en un archivo externo (`prompt.text`).
* **Arquitectura Limpia y Modular:** Estructura basada en el patrón Controlador-Servicio-Modelo que separa la lógica de negocio, las consultas a la base de datos (Mongoose) y el renderizado dinámico de vistas en el servidor (Pug).

## 🛠️ Tecnologías Utilizadas

* **Backend & Servidor:** Node.js, Express
* **Base de Datos:** MongoDB & Mongoose (ODM para el modelado de datos)
* **Comunicación en Tiempo Real:** Socket.io (WebSockets para el chat bidireccional)
* **Frontend & Vistas:** Pug (Motor de plantillas dinámicas), CSS personalizado.
* **Inteligencia Artificial:** `@google/genai` (Integración oficial con la API de Gemini)
* **Seguridad y Entorno:** Dotenv (Gestión de variables de entorno) y Middlewares de autenticación personalizados

Estructura del Proyecto-
├── config/
│   └── db.js                       # Conexión a la base de datos
├── controllers/
│   ├── System/                     # Controladores administrativos y del sistema
│   │   ├── authController.js
│   │   ├── CambiosController.js
│   │   └── vehiculoController.js
│   └── User/                       # Controladores orientados al usuario final
│       ├── soporteControllers.js
│       └── userController.js
├── MiddleWares/                    # Filtros de autenticación y seguridad
│   ├── AuthClienteMiddleware.js
│   └── AuthMiddleware.js
├── models/                         # Modelos de datos (Mongoose)
│   ├── Cambios.js
│   ├── chats.js
│   ├── Usuario_Externo.js
│   ├── Usuario.js
│   └── Vehiculo.js
├── prompts/
│   └── prompt.text                 # Contexto y directivas para la API de Gemini
├── public/                         # Archivos estáticos
│   ├── js/                         # Scripts del lado del cliente
│   └── styles.css                  # Hojas de estilo globales
├── routes/                         # Definición de endpoints de la aplicación
│   ├── authRoutes.js
│   ├── CambiosRoutes.js
│   ├── PersonasRoutes.js
│   ├── soporteRoutes.js
│   ├── userExRoutes.js
│   └── VehiculosRoutes.js
├── services/
│   └── geminiService.js            # Lógica de comunicación con Google Gemini
├── views/                          # Plantillas de Pug para la interfaz de usuario
│   ├── AgregarDatos.pug
│   ├── AgregarUsuario.pug
│   ├── EditarUsuario.pug
│   ├── EditarVehiculo.pug
│   ├── eliminarVehiculo.pug
│   ├── index.pug
│   ├── login.pug
│   ├── mis-vehiculos.pug
│   ├── registro.pug
│   ├── soporte.pug
│   ├── soporteDashboard.pug
│   ├── SoporteLogin.pug
│   ├── usuarios.pug
│   └── Vehiculos.pug
├── .env                            # Variables de entorno (Local/Privado)
├── Index.js                        # Punto de entrada principal de la aplicación
├── package.json                    # Configuración de scripts y dependencias
└── README.md                       # Documentación del sistema