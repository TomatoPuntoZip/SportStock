# SportStock

## Breve resumen
SportStock es una aplicación web de gestión de inventario deportivo desarrollada con HTML, CSS y JavaScript puro (vanilla), sin frameworks ni librerías externas. Permite administrar productos, gestionar solicitudes de alquiler y controlar usuarios mediante un sistema de roles diferenciados.
Los datos se persisten en el navegador usando localStorage, lo que permite que la información se mantenga entre sesiones sin necesidad de un servidor backend.

### Tecnologías usadas
- HTML5
- CSS3
- JavaScript

## Cómo usar la aplicación

### Crear usuario
1. En la interfaz de login haz clic en el botón **Regístrate** debajo del botón de iniciar sesión
2. Rellena los campos solicitados: nombre de usuario, email, contraseña y confirmación de contraseña
3. Haz clic en el botón **Crear cuenta** y ya puedes ingresar con las credenciales que registraste

### Como Administrador
1. Inicia sesión con usuario `admin` y contraseña `admin123`
2. Al ingresar te dara una vista de interfaz del inventario, lugar donde puedes agregar producto, editar productos existentes y eliminarlos
3. En el apartado de alquileres te permite exportar un CSV con todos los alquileres creados, el historial de alquileres y los filtros entre los pendientes, los aprobados, los rechazados y los devueltos, ademas de permitirte marcar un articulo como devuelto y a la hora de que un alquiler sea realizado por un usuario te permite aceptarlo o rechazarlo y puedes agregar un comentario adjunto
4. en el apartado de usuarios te permite ver todos los usuarios existentes e incluso eliminarlos
5. el perfil es un perfil generico diseñado solo para la demostracion 
6. puedes cerrar sesion en cualquier momento

### Como Usuario
1. Inicia sesión con usuario `user` y contraseña `user123`
2. La interfaz te permite ver el historial de los articulos alquilados por ti
3. se te permite solicitar alquileres y se te pediran algunos datos especificos como la cantidad y la fecha maxima de devolucion del alquiler 
4. puedes cerrar sesion en cualquier momento

## Prompts utilizados

### 1. Generación de la aplicación base
**Prompt:** "Quiero que generes una aplicación web moderna e interactiva 
para un sistema de gestión de inventario de equipo deportivo..."
**Para qué sirvió:** Generó la estructura completa de la aplicación: 
pantalla de login con validación, sistema de roles (ADMIN/USUARIO), 
dashboard administrativo con CRUD de productos, vista de usuario 
para consultar el catálogo, y el diseño visual general.

### 2. Sistema de registro
**Prompt:** "Ayudame a crear un sistema de registro de usuario 
funcional sin base de datos"
**Para qué sirvió:** Implementó el formulario de registro con validaciones 
(usuario único, email válido, contraseñas coincidentes) y almacenamiento 
de usuarios en localStorage, sin necesidad de servidor ni base de datos.

### 3. Sistema de alquileres
**Prompt:** "Quiero que los usuarios puedan alquilar productos de la 
tienda que estén en stock..."
**Para qué sirvió:** Creó el flujo completo de solicitudes: el usuario 
pide un alquiler, el stock se valida, y el administrador recibe una 
notificación para aprobar o rechazar la solicitud.

### 4. Ventana de confirmación e inventario del usuario
**Prompt:** "Cuando el usuario solicite el alquiler que le salga una 
pequeña ventana emergente..."
**Para qué sirvió:** Agregó el modal de confirmación que aparece tras 
enviar una solicitud, y creó el inventario personal del usuario donde 
puede ver los productos que tiene alquilados aprobados.

### 5. Acceso al inventario del usuario
**Prompt:** "Crea la forma de acceso al inventario del usuario"
**Para qué sirvió:** Implementó el botón "Mi historial" con un panel 
deslizable animado que muestra el estado de todos los alquileres 
del usuario sin salir del catálogo.