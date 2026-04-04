-- ==========================================
-- DATOS PARA LA BASE DE DATOS: inventario_tareas
-- ==========================================
USE inventario_tareas;

-- ==========================================
-- 1. USUARIOS
-- ==========================================
INSERT INTO users (id, name, documento, rol, estado) VALUES
(1, 'SUPER ADMIN',        '10203040', 'admin', 'activo'),
(2, 'María García',       '20304050', 'user',  'activo'),
(3, 'Carlos Rodríguez',   '30405060', 'user',  'activo'),
(4,  'Andrés Martínez',    '40506070', 'user',  'activo'),
(5,  'Laura Sánchez',      '50607080', 'user',  'activo'),
(6,  'Felipe Torres',      '60708090', 'user',  'inactivo'),
(7,  'Valentina Ríos',     '70809010', 'user',  'activo'),
(8,  'Santiago Herrera',   '80901020', 'user',  'activo'),
(9,  'Gabriela Moreno',    '90102030', 'user',  'inactivo'),
(10, 'Camilo Vargas',      '10203041', 'user',  'activo'),
(11, 'Natalia Ospina',     '11223344', 'admin', 'activo');
-- ==========================================
-- 2. TAREAS
-- ==========================================
INSERT INTO tasks (id, created_ud, title, description, status) VALUES
(1, '2026-03-19 14:09:28', 'Nueva tarea de prueba',  'Verificacion',                    'pendiente'),
(2, '2026-03-21 00:04:07', 'Tarea de prueba',        'asignacion multiples usuarios',   'pendiente'),
(3, '2026-03-21 01:18:11', 'Visualizar listado',     'Listar proceso de usuarios',      'completada'),
(4, '2026-03-21 01:18:38', 'Verificar backend',      'verificacion del backend',        'completada'),
(5,  '2026-03-22 08:00:00', 'Diseñar base de datos',          'Crear el modelo entidad-relación del sistema',           'completada'),
(6,  '2026-03-22 09:15:00', 'Configurar servidor',            'Instalar y configurar el servidor Node.js en producción', 'completada'),
(7,  '2026-03-22 10:30:00', 'Implementar autenticación',      'Agregar JWT y control de sesiones',                      'en proceso'),
(8,  '2026-03-22 11:00:00', 'Crear endpoints REST',           'Definir y documentar todas las rutas de la API',         'en proceso'),
(9,  '2026-03-23 08:00:00', 'Pruebas unitarias backend',      'Escribir tests para los servicios principales',          'pendiente'),
(10, '2026-03-23 09:00:00', 'Diseñar interfaz de usuario',    'Prototipar las pantallas principales en Figma',          'completada'),
(11, '2026-03-23 10:00:00', 'Integrar frontend con API',      'Conectar las vistas React con los endpoints REST',       'en proceso'),
(12, '2026-03-23 11:30:00', 'Revisión de código',             'Realizar code review del módulo de inventario',          'pendiente'),
(13, '2026-03-24 08:00:00', 'Documentar API con Swagger',     'Agregar anotaciones Swagger a todos los endpoints',      'pendiente'),
(14, '2026-03-24 09:00:00', 'Migrar datos de prueba',         'Cargar el script data.sql en el entorno de staging',     'pendiente'),
(15, '2026-03-24 10:00:00', 'Optimizar consultas SQL',        'Agregar índices y revisar queries lentas',               'en proceso'),
(16, '2026-03-24 11:00:00', 'Configurar variables de entorno','Revisar y actualizar el archivo .env para producción',   'completada'),
(17, '2026-03-25 08:00:00', 'Gestión de roles y permisos',    'Implementar middleware de autorización por rol',         'en proceso'),
(18, '2026-03-25 09:00:00', 'Módulo de reportes',             'Generar reportes de inventario en formato PDF',          'pendiente'),
(19, '2026-03-25 10:30:00', 'Corrección de bugs sprint 1',    'Resolver los issues reportados en el sprint anterior',   'completada'),
(20, '2026-03-25 11:00:00', 'Despliegue en staging',          'Publicar la versión 1.0 en el servidor de staging',      'completada'),
(21, '2026-03-26 08:00:00', 'Capacitación al equipo',         'Presentar el sistema al equipo de ventas',               'pendiente'),
(22, '2026-03-26 09:00:00', 'Mantenimiento preventivo BD',    'Hacer backup y revisar integridad de la base de datos',  'pendiente'),
(23, '2026-03-27 08:00:00', 'Actualizar dependencias npm',    'Revisar y actualizar paquetes desactualizados',          'en proceso'),
(24, '2026-03-28 08:00:00', 'Presentación final del proyecto','Preparar la demo y la documentación de entrega',         'pendiente');
-- ==========================================
-- 3. ASIGNACIONES DE TAREAS
-- ==========================================
INSERT INTO task_assignments (task_id, user_id) VALUES
(1, 1),  -- "Nueva tarea de prueba"  -> SUPER ADMIN
(2, 2),  -- "Tarea de prueba"        -> María García
(2, 3),  -- "Tarea de prueba"        -> Carlos Rodríguez
(3, 2),  -- "Visualizar listado"     -> María García
(4, 3),  -- "Verificar backend"      -> Carlos Rodríguez
(5,  4),   -- Diseñar base de datos          -> Andrés Martínez
(5,  11),  -- Diseñar base de datos          -> Natalia Ospina
(6,  5),   -- Configurar servidor            -> Laura Sánchez
(7,  4),   -- Implementar autenticación      -> Andrés Martínez
(7,  7),   -- Implementar autenticación      -> Valentina Ríos
(8,  5),   -- Crear endpoints REST           -> Laura Sánchez
(8,  8),   -- Crear endpoints REST           -> Santiago Herrera
(9,  10),  -- Pruebas unitarias backend      -> Camilo Vargas
(10, 7),   -- Diseñar interfaz de usuario    -> Valentina Ríos
(11, 7),   -- Integrar frontend con API      -> Valentina Ríos
(11, 4),   -- Integrar frontend con API      -> Andrés Martínez
(12, 11),  -- Revisión de código             -> Natalia Ospina
(12, 8),   -- Revisión de código             -> Santiago Herrera
(13, 5),   -- Documentar API con Swagger     -> Laura Sánchez
(14, 10),  -- Migrar datos de prueba         -> Camilo Vargas
(15, 8),   -- Optimizar consultas SQL        -> Santiago Herrera
(15, 10),  -- Optimizar consultas SQL        -> Camilo Vargas
(16, 11),  -- Configurar variables de entorno -> Natalia Ospina
(17, 4),   -- Gestión de roles y permisos    -> Andrés Martínez
(17, 11),  -- Gestión de roles y permisos    -> Natalia Ospina
(18, 7),   -- Módulo de reportes             -> Valentina Ríos
(19, 8),   -- Corrección de bugs sprint 1    -> Santiago Herrera
(19, 10),  -- Corrección de bugs sprint 1    -> Camilo Vargas
(20, 5),   -- Despliegue en staging          -> Laura Sánchez
(20, 11),  -- Despliegue en staging          -> Natalia Ospina
(21, 11),  -- Capacitación al equipo         -> Natalia Ospina
(22, 10),  -- Mantenimiento preventivo BD    -> Camilo Vargas
(23, 4),   -- Actualizar dependencias npm    -> Andrés Martínez
(23, 5),   -- Actualizar dependencias npm    -> Laura Sánchez
(24, 11);  -- Presentación final del proyecto -> Natalia Ospina