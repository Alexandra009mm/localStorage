/* === CONFIGURACIÓN DE ELEMENTOS DEL DOM === */
const inputTarea       = document.getElementById('inputTarea');
const btnAgregar       = document.getElementById('btnAgregar');
const listaTareas      = document.getElementById('listaTareas');
const bienvenidaEl     = document.getElementById('bienvenida');
const toggleModo       = document.getElementById('toggleModo');
const totalTexto       = document.getElementById('totalTexto');
const pendientesTexto  = document.getElementById('pendientesTexto');
const completadasTexto = document.getElementById('completadasTexto');
const btnsFiltro       = document.querySelectorAll('.filtros button');

/* === GESTIÓN DE ALMACENAMIENTO (localStorage) === */
function cargarTareas() {
  const datosGuardados = localStorage.getItem('tareas'); 
  if (datosGuardados) {
    return JSON.parse(datosGuardados);
  } else {
    return [];
  }
}

function guardarTareas(listaDeTareas) {
  const textoParaGuardar = JSON.stringify(listaDeTareas);
  localStorage.setItem('tareas', textoParaGuardar); 
}

let tareas = cargarTareas();

/* === GESTIÓN DE SESIÓN (sessionStorage) === */
function obtenerFiltro() {
  const filtroGuardado = sessionStorage.getItem('filtroActivo');
  if (filtroGuardado) {
    return filtroGuardado;
  } else {
    return 'todas';
  }
}

function guardarFiltro(nuevoFiltro) {
  sessionStorage.setItem('filtroActivo', nuevoFiltro);
}

function verificarAvisoBienvenida() {
  const yaSeMostro = sessionStorage.getItem('bienvenida'); 

  if (yaSeMostro === null) {
    bienvenidaEl.textContent = 'Control de actividades activado de manera exitosa.';
    sessionStorage.setItem('bienvenida', 'true'); 
  } else {
    bienvenidaEl.textContent = ''; 
  }
}

/* === FUNCIÓN PRINCIPAL DE RENDERIZADO === */
function renderizar() {
  const filtroActual = obtenerFiltro();

  // Actualizar estado visual de los botones de filtro
  btnsFiltro.forEach(btn => {
    if (btn.dataset.filtro === filtroActual) {
      btn.classList.add('activo');
    } else {
      btn.classList.remove('activo');
    }
  });

  // Filtrado de tareas
  let tareasFiltradas = [];
  for (let i = 0; i < tareas.length; i++) {
    const tareaIndividual = tareas[i];

    if (filtroActual === 'pendientes') {
      if (tareaIndividual.completada === false) {
        tareasFiltradas.push(tareaIndividual);
      }
    } else if (filtroActual === 'completadas') {
      if (tareaIndividual.completada === true) {
        tareasFiltradas.push(tareaIndividual);
      }
    } else {
      tareasFiltradas.push(tareaIndividual);
    }
  }

  listaTareas.innerHTML = '';

  if (tareasFiltradas.length === 0) {
    listaTareas.innerHTML = '<p class="vacio">No se registran actividades en esta sección.</p>';
  }

  // Construcción de la lista de tareas en el HTML
  for (let i = 0; i < tareasFiltradas.length; i++) {
    const tarea = tareasFiltradas[i];

    // Elemento contenedor (li)
    const li = document.createElement('li');
    li.className = 'tarea-item';
    if (tarea.completada === true) {
      li.classList.add('tarea-completada');
    }

    // Checkbox de estado
    const check = document.createElement('input');
    check.type = 'checkbox';
    check.checked = tarea.completada;
    check.addEventListener('change', () => {
      cambiarEstadoTarea(tarea.id);
    });

    // Texto de la tarea
    const span = document.createElement('span');
    span.className = 'tarea-texto';
    span.textContent = tarea.texto;
    span.addEventListener('click', () => {
      habilitarFormularioEdicion(li, span, tarea);
    });

    // Botón eliminar
    const btnBorrar = document.createElement('button');
    btnBorrar.className = 'btn-borrar';
    btnBorrar.textContent = 'Eliminar';
    btnBorrar.addEventListener('click', () => {
      eliminarRegistroTarea(tarea.id);
    });

    li.appendChild(check);
    li.appendChild(span);
    li.appendChild(btnBorrar);
    listaTareas.appendChild(li);
  }

  // Cálculo y actualización de contadores
  let contadorCompletadas = 0;
  for (let i = 0; i < tareas.length; i++) {
    if (tareas[i].completada === true) {
      contadorCompletadas = contadorCompletadas + 1;
    }
  }

  let contadorPendientes = tareas.length - contadorCompletadas;

  totalTexto.textContent = 'Total: ' + tareas.length;
  pendientesTexto.textContent = ' Pendientes: ' + contadorPendientes;
  completadasTexto.textContent = ' Completadas: ' + contadorCompletadas;
}

/* === OPERACIONES: AGREGAR, MODIFICAR Y ELIMINAR === */
function procesarNuevaTarea() {
  const textoLimpio = inputTarea.value.trim(); 

  if (textoLimpio === '') {
    return; 
  }

  const nuevaTarea = {
    id: Date.now(), 
    texto: textoLimpio,
    completada: false 
  };

  tareas.push(nuevaTarea);       
  guardarTareas(tareas);         
  inputTarea.value = '';        
  renderizar();                  
}

function cambiarEstadoTarea(idUnico) {
  for (let i = 0; i < tareas.length; i++) {
    if (tareas[i].id === idUnico) {
      if (tareas[i].completada === true) {
        tareas[i].completada = false;
      } else {
        tareas[i].completada = true;
      }
    }
  }
  guardarTareas(tareas); 
  renderizar();          
}

function eliminarRegistroTarea(idUnico) {
  let nuevaListaSinTarea = [];
  for (let i = 0; i < tareas.length; i++) {
    if (tareas[i].id !== idUnico) {
      nuevaListaSinTarea.push(tareas[i]);
    }
  }
  tareas = nuevaListaSinTarea; 
  guardarTareas(tareas);       
  renderizar();                
}

function habilitarFormularioEdicion(contenedorLi, etiquetaSpan, objetoTarea) {
  const inputTemporal = document.createElement('input');
  inputTemporal.type = 'text';
  inputTemporal.value = objetoTarea.texto;
  inputTemporal.className = 'input-editar';

  contenedorLi.replaceChild(inputTemporal, etiquetaSpan);
  inputTemporal.focus(); 

  function guardarCambiosEdicion() {
    const textoModificado = inputTemporal.value.trim();

    if (textoModificado !== '') {
      for (let i = 0; i < tareas.length; i++) {
        if (tareas[i].id === objetoTarea.id) {
          tareas[i].texto = textoModificado;
        }
      }
      guardarTareas(tareas); 
    }
    renderizar(); 
  }

  inputTemporal.addEventListener('blur', guardarCambiosEdicion);
  inputTemporal.addEventListener('keydown', function(evento) {
    if (evento.key === 'Enter') {
      guardarCambiosEdicion();
    }
  });
}

/* === CONFIGURACIÓN MODO OSCURO === */
function controlarModoOscuro(activar) {
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

// Inicializar modo oscuro según la última visita
const estadoModoGuardado = localStorage.getItem('modoOscuro') === 'true';
controlarModoOscuro(estadoModoGuardado);

toggleModo.addEventListener('change', () => {
  controlarModoOscuro(toggleModo.checked);
});

/* === EVENTOS DE LA INTERFAZ (LISTENERS) === */
btnsFiltro.forEach(btn => {
  btn.addEventListener('click', () => {
    const filtroElegido = btn.dataset.filtro; 
    guardarFiltro(filtroElegido);             
    renderizar();                             
  });
});

btnAgregar.addEventListener('click', procesarNuevaTarea);

inputTarea.addEventListener('keydown', function(evento) {
  if (evento.key === 'Enter') {
    procesarNuevaTarea();
  }
});


/* === INICIALIZACIÓN DE LA APP === */
verificarAvisoBienvenida(); 
renderizar();      