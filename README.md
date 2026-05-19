# Control de Actividades Laborales — Sistema de Gestión

Solución modular construida bajo el estándar de JavaScript Vanilla enfocado en la manipulación interactiva del Modelo de Objetos del Documento (DOM) e integración avanzada de almacenamiento local nativo del navegador (`Web Storage API`).

---

## 🚀 Instrucciones de Despliegue Local

Para ejecutar y probar la aplicación en su estación de trabajo local, efectúe los siguientes pasos:

1. Guarde los archivos `index.html`, `styles.css` y `script.js` dentro de un mismo directorio o carpeta en su sistema.
2. Ejecute el archivo `index.html` haciendo doble clic sobre él para abrirlo en su navegador web predeterminado.
3. No requiere herramientas de compilación, servidores virtuales de desarrollo ni dependencias externas de Node.js.

---

## 💼 Matriz Funcional del Sistema

| Operación / Control | Mecanismo de Activación | Comportamiento en Interfaz |
| :--- | :--- | :--- |
| **Ingreso de Actividad** | Digitar en el campo y pulsar botón `+` o tecla `Enter` | Valida espacios y concatena dinámicamente un nuevo elemento. |
| **Cambio de Estado** | Activar o desactivar el control Checkbox de la fila | Aplica estilos dinámicos de tachado e interactúa con contadores. |
| **Remoción Física** | Hacer clic en el control "Eliminar" de la actividad | Remueve el elemento del almacenamiento global y actualiza la vista. |
| **Segmentación (Filtros)** | Pulsar botones superiores: Todas / Pendientes / Completadas | Segmenta en memoria el listado reduciendo el impacto de redibujado. |
| **Edición en Línea** | Hacer clic directo sobre el texto descriptivo | Convierte el texto en un campo de edición en vivo de forma sutil. |
| **Preferencia Lumínica** | Accionar el interruptor localizado en el extremo superior derecho | Modifica la paleta cromática a un entorno de baja iluminación. |

---

## 🗄️ Arquitectura y Distribución del Almacenamiento

El sistema separa estrictamente los ciclos de vida de la información utilizando dos herramientas nativas del navegador para evitar la saturación o la persistencia innecesaria de datos contextuales.

### 1. Persistencia de Datos Primarios (`localStorage`)
Se utiliza para conservar información crítica que debe resistir cierres del navegador o reinicios del sistema operativo.

* `"tareas"` *(Cadena de Texto JSON)*: Conserva el listado centralizado estructurado como objetos JavaScript.
* `"modoOscuro"` *(Cadena de Texto)*: Almacena estados `"true"` o `"false"` de preferencia visual del usuario.

### 2. Persistencia de Sesión Volátil (`sessionStorage`)
Se utiliza exclusivamente para datos de navegación transitorios que pierden vigencia una vez terminada la sesión del usuario.

* `"filtroActivo"` *(Texto Plano)*: Guarda qué categoría de visualización se mantiene activa (`"todas"`, `"pendientes"` o `"completadas"`). Evita alterar el inicio estándar en futuras visitas.
* `"bienvenida"` *(Texto Plano)*: Bandera de control (`"true"`) utilizada para evitar la reaparición del aviso informativo durante recargas de página en una misma sesión.

---

## 🧱 Estructura de Datos del Objeto Tarea

Cada ítem administrado por el motor de JavaScript responde al siguiente modelo estructurado de propiedades:

```json
{
  "id": 1716134400000,
  "texto": "Actualizar planillas de inventario",
  "completada": false
}