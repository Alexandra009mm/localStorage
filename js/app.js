// Elementos del HTML
const inputTarea = document.getElementById('inputTarea');
const btnAgregar = document.getElementById('btnAgregar');
const listaTareas = document.getElementById('listaTareas');
const bienvenidaEl = document.getElementById('bienvenida');
const toggleModo = document.getElementById('toggleModo');
const totalTexto = document.getElementById('totalTexto');
const pendientesTexto = document.getElementById('pendientesTexto');
const completadasTexto = document.getElementById('completadasTexto');
const btnsFiltro = document.querySelectorAll('.filtros button');

// Cargar tareas del almacenamiento del navegador
function cargarTareas() {
  const datosGuardados = localStorage.getItem('tareas');
  if (datosGuardados) {
    return JSON.parse(datosGuardados);
  }
  return [];
}

// Guardar tareas en el almacenamiento del navegador
function guardarTareas() {
  localStorage.setItem('tareas', JSON.stringify(tareas));
}

let tareas = cargarTareas();

// Función principal para dibujar las tareas en la pantalla
function renderizar() {
  const filtroActual = sessionStorage.getItem('filtroActivo') || 'todas';

  // Marcar cuál botón de filtro está seleccionado
  btnsFiltro.forEach(btn => {
    if (btn.dataset.filtro === filtroActual) {
      btn.classList.add('activo');
    } else {
      btn.classList.remove('activo');
    }
  });

  // Filtrar tareas usando un bucle FOR tradicional
  let tareasFiltradas = [];
  for (let i = 0; i < tareas.length; i++) {
    const tarea = tareas[i];
    if (filtroActual === 'pendientes' && tarea.completada === false) {
      tareasFiltradas.push(tarea);
    } else if (filtroActual === 'completadas' && tarea.completada === true) {
      tareasFiltradas.push(tarea);
    } else if (filtroActual === 'todas') {
      tareasFiltradas.push(tarea);
    }
  }

  // Limpiar la lista visual
  listaTareas.innerHTML = '';

  if (tareasFiltradas.length === 0) {
    listaTareas.innerHTML = '<p class="vacio">No se registran actividades en esta sección.</p>';
  }

  // Crear los elementos HTML de cada tarea en pantalla
  for (let i = 0; i < tareasFiltradas.length; i++) {
    const tarea = tareasFiltradas[i];

    const li = document.createElement('li');
    li.className = 'tarea-item';
    if (tarea.completada === true) {
      li.classList.add('tarea-completada');
    }

    // Checkbox para completar
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = tarea.completada;
    check.addEventListener('change', () => {
      tarea.completada = !tarea.completada; // Invierte el valor (true/false)
      guardarTareas();
      renderizar();
    });

    // Texto de la tarea
    const span = document.createElement('span');
    span.className = 'tarea-texto';
    span.textContent = tarea.texto;
    span.addEventListener('click', () => habilitarEdicion(li, span, tarea));

    // Botón borrar
    const btnBorrar = document.createElement('button');
    btnBorrar.className = 'btn-borrar';
    btnBorrar.textContent = 'Eliminar';
    btnBorrar.addEventListener('click', () => {
      // Filtrar para eliminar la tarea seleccionada
      let nuevaLista = [];
      for (let j = 0; j < tareas.length; j++) {
        if (tareas[j].id !== tarea.id) {
          nuevaLista.push(tareas[j]);
        }
      }
      tareas = nuevaLista;
      guardarTareas();
      renderizar();
    });

    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(btnBorrar);
    listaTareas.appendChild(li);
  }

  // Calcular contadores
  let completadas = 0;
  for (let i = 0; i < tareas.length; i++) {
    if (tareas[i].completada === true) {
      completadas++;
    }
  }

  totalTexto.textContent = 'Total: ' + tareas.length;
  pendientesTexto.textContent = ' Pendientes: ' + (tareas.length - completadas);
  completadasTexto.textContent = ' Completadas: ' + completadas;


  // Crear una nueva tarea
  function agregarNuevaTarea() {
    const textoLimpio = inputTarea.value.trim();
    if (textoLimpio === '') return;

    const nuevaTarea = {
      id: Date.now(),
      texto: textoLimpio,
      completada: false
    };

    tareas.push(nuevaTarea);
    guardarTareas();
    inputTarea.value = '';
    renderizar();
  }

  // Modo de edición al hacer clic en el texto
  function habilitarEdicion(contenedorLi, etiquetaSpan, objetoTarea) {
    const inputTemporal = document.createElement('input');
    inputTemporal.type = 'text';
    inputTemporal.value = objetoTarea.texto;
    inputTemporal.className = 'input-editar';

    contenedorLi.replaceChild(inputTemporal, etiquetaSpan);
    inputTemporal.focus();

    function guardarEdicion() {
      const textoModificado = inputTemporal.value.trim();
      if (textoModificado !== '') {
        objetoTarea.texto = textoModificado;
        guardarTareas();
      }
      renderizar();
    }

    inputTemporal.addEventListener('blur', guardarEdicion);
    inputTemporal.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') guardarEdicion();
    });
  }

  // Configuración y control del Modo Oscuro
  function aplicarModoOscuro(activar) {
    if (activar === true) {
      document.body.classList.add('dark');
      toggleModo.checked = true;
      localStorage.setItem('modoOscuro', 'true');
    } else {
      document.body.classList.remove('dark');
      toggleModo.checked = false;
      localStorage.setItem('modoOscuro', 'false');
    }
  }

  // Eventos de los botones de filtro
  btnsFiltro.forEach(btn => {
    btn.addEventListener('click', () => {
      sessionStorage.setItem('filtroActivo', btn.dataset.filtro);
      renderizar();
    });
  });

  // Eventos para añadir tareas
  btnAgregar.addEventListener('click', agregarNuevaTarea);
  inputTarea.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') agregarNuevaTarea();
  });

  toggleModo.addEventListener('change', () => {
    aplicarModoOscuro(toggleModo.checked);
  });

  // Saludo de bienvenida único por sesión
  if (sessionStorage.getItem('bienvenida') === null) {
    sessionStorage.setItem('bienvenida', 'true');
  }

  // Inicializar la aplicación al cargar
  aplicarModoOscuro(localStorage.getItem('modoOscuro') === 'true');
  renderizar();
}
