-- 1. Crear la base de datos
CREATE DATABASE IF NOT EXISTS inventario_tareas;

-- 2. Crear el usuario restringido a localhost
CREATE USER 'app_user'@'localhost' IDENTIFIED BY '#ProyectoIntegrador2026';

-- 3. Asignar todos los privilegios de ESA base de datos a ESTE usuario
GRANT ALL PRIVILEGES ON inventario_tareas.* TO 'app_user'@'localhost';

-- 4. Aplicar los cambios de privilegios inmediatamente
FLUSH PRIVILEGES;

-- 5. Seleccionar la base de datos para empezar a crear las tablas
USE inventario_tareas;

-- 6. Crear la tabla de Users (Debe ir primero porque no depende de nadie)
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    documento VARCHAR(20) NOT NULL UNIQUE,
    rol ENUM('admin', 'user') NOT NULL,
    estado ENUM('activo', 'inactivo') NOT NULL
);

-- 7. Crear la tabla de Tareas
CREATE TABLE tasks (
    id INT AUTO_INCREMENT PRIMARY KEY,
    created_ud TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    status ENUM('pendiente', 'en proceso', 'completada') NOT NULL
);

-- 8. Crear la tabla de asignación de tareas a usuarios (relación muchos a muchos)
CREATE TABLE task_assignments (
    id INT AUTO_INCREMENT PRIMARY KEY,
    task_id INT,
    user_id INT,
    
    -- Definición de la Llave Foránea con restricción de eliminación
    CONSTRAINT fk_task_id 
        FOREIGN KEY (task_id) 
        REFERENCES tasks(id) 
        ON DELETE RESTRICT 
        ON UPDATE CASCADE,
    CONSTRAINT fk_user_id 
        FOREIGN KEY (user_id) 
        REFERENCES users(id) 
        ON DELETE CASCADE
);