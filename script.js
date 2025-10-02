document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias del DOM y variables de estado ---
    const loginBtn = document.getElementById('btn-login');
    const registerBtn = document.getElementById('btn-register');
    const registerMenu = document.getElementById('register-menu');
    const registerMedicoLink = document.getElementById('register-medico');
    const registerPacienteLink = document.getElementById('register-paciente');
    const btnIniciarAhora = document.getElementById('btn-iniciar-ahora');

    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    
    const closeLoginModal = document.getElementById('close-login-modal');
    const closeRegisterModal = document.getElementById('close-register-modal');
    const linkRegistroModal = document.getElementById('link-registro-modal'); // Link desde modal de login

    const loginForm = document.getElementById('login-form');
    const registroForm = document.getElementById('registro-form');
    const campoEspecialidad = document.getElementById('campo-especialidad');
    const registroTitulo = document.getElementById('registro-titulo');
    const registroTipoInput = document.getElementById('registro-tipo');

    // Estado del usuario
    let usuarioActual = localStorage.getItem('usuarioActual') || null; 
    let tipoUsuario = localStorage.getItem('tipoUsuario') || null;
    
    // Arrays de datos (simulación de base de datos)
    let pacientes = [];
    let medicos = []; 
    let citas = [];    
    let metricas = []; 
    let medicamentos = []; 
    let documentos = [];

    let currentCalendarDate = new Date();

    // --- UTILITIES: PERSISTENCIA (localStorage) ---
    function guardarDatos() {
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        localStorage.setItem('medicos', JSON.stringify(medicos));
        localStorage.setItem('citas', JSON.stringify(citas));
        localStorage.setItem('metricas', JSON.stringify(metricas));
        localStorage.setItem('medicamentos', JSON.stringify(medicamentos));
        localStorage.setItem('documentos', JSON.stringify(documentos));
    }

    function cargarDatosGuardados() {
        const datosPacientes = localStorage.getItem('pacientes');
        const datosMedicos = localStorage.getItem('medicos');
        const datosCitas = localStorage.getItem('citas');
        const datosMetricas = localStorage.getItem('metricas');
        const datosMedicamentos = localStorage.getItem('medicamentos');
        const datosDocumentos = localStorage.getItem('documentos');

        if (datosPacientes) pacientes = JSON.parse(datosPacientes);
        if (datosMedicos) medicos = JSON.parse(datosMedicos);
        if (datosCitas) citas = JSON.parse(datosCitas);
        if (datosMetricas) metricas = JSON.parse(datosMetricas);
        if (datosMedicamentos) medicamentos = JSON.parse(datosMedicamentos);
        if (datosDocumentos) documentos = JSON.parse(datosDocumentos);

        // Datos de ejemplo iniciales (Médicos y Pacientes)
        if (medicos.length === 0) {
            medicos.push({ id: 1, nombre: 'Alejandro', apellido: 'Soto', especialidad: 'Cardiología', email: 'medico@cuidame.com', password: 'pass' });
        }
        if (pacientes.length === 0) {
            pacientes.push({ id: 1, nombre: 'Ana', apellido: 'García', email: 'paciente@cuidame.com', password: 'pass' });
        }
        guardarDatos();
    }
    
    // --- LÓGICA DE NAVEGACIÓN Y MODALES ---

    function iniciarSesionYRedirigir(email, tipo) {
        localStorage.setItem('usuarioActual', email);
        localStorage.setItem('tipoUsuario', tipo);
        window.location.href = 'pacientes.html'; 
    }

    // Navegación de Dashboards (solo en pacientes.html)
    function mostrarDashboard(tipo) {
        const medicoDashboard = document.getElementById('medico-dashboard');
        const pacienteDashboard = document.getElementById('paciente-dashboard');
        
        if (!medicoDashboard || !pacienteDashboard) return; 
        
        medicoDashboard.style.display = 'none';
        pacienteDashboard.style.display = 'none';
        
        if (tipo === 'medico') {
            medicoDashboard.style.display = 'block';
            cargarPacientes();
        } else if (tipo === 'paciente') {
            pacienteDashboard.style.display = 'block';
            cargarPerfilPaciente();
            cargarHistorial(); 
            renderCalendar(); 
        }
    }

    // --- MANEJO DE MODALES ---

    // Función para mostrar el modal de registro y configurar el rol
    function mostrarModalRegistro(rol) {
        if (loginModal) loginModal.style.display = 'none';
        if (!registerModal) return;

        registerModal.style.display = 'flex';
        registroTipoInput.value = rol;
        registroTitulo.textContent = `Registro como ${rol.charAt(0).toUpperCase() + rol.slice(1)}`;
        
        if (rol === 'medico') {
            campoEspecialidad.style.display = 'block';
        } else {
            campoEspecialidad.style.display = 'none';
        }
        
        registerMenu.classList.remove('show');
    }


    // Eventos de botones de la Landing Page
    loginBtn?.addEventListener('click', () => {
        if (loginModal) loginModal.style.display = 'flex';
        if (registerMenu) registerMenu.classList.remove('show');
    });

    // Nuevo: Toggle para el menú de registro
    registerBtn?.addEventListener('click', (e) => {
        e.stopPropagation(); // Evita que el evento se propague al documento
        registerMenu.classList.toggle('show');
    });

    // Nuevo: Enlaces del menú de registro
    registerMedicoLink?.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarModalRegistro('medico');
    });
    
    registerPacienteLink?.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarModalRegistro('paciente');
    });
    
    // Nuevo: Botón "Empezar Ahora"
    btnIniciarAhora?.addEventListener('click', () => {
        if (loginModal) loginModal.style.display = 'flex';
    });

    // Cierre de modales
    closeLoginModal?.addEventListener('click', () => loginModal.style.display = 'none');
    closeRegisterModal?.addEventListener('click', () => registerModal.style.display = 'none');
    
    // Link "Regístrate aquí"
    linkRegistroModal?.addEventListener('click', (e) => {
        e.preventDefault();
        mostrarModalRegistro('paciente'); // Por defecto, ofrece registro como paciente
    });
    
    // Cerrar menú de registro al hacer clic fuera
    document.addEventListener('click', (e) => {
        if (registerMenu && !registerBtn.contains(e.target)) {
             registerMenu.classList.remove('show');
        }
    });


    // --- LÓGICA DE FORMULARIOS ---

    // 1. Formulario de LOGIN
    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        // Buscar en médicos
        const medico = medicos.find(m => m.email === email && m.password === password);
        if (medico) {
            alert(`¡Bienvenido Dr./Dra. ${medico.apellido}!`);
            iniciarSesionYRedirigir(email, 'medico');
            return;
        }

        // Buscar en pacientes
        const paciente = pacientes.find(p => p.email === email && p.password === password);
        if (paciente) {
            alert(`¡Bienvenido(a) ${paciente.nombre}!`);
            iniciarSesionYRedirigir(email, 'paciente');
            return;
        }

        alert('Credenciales incorrectas o usuario no encontrado.');
    });

    // 2. Formulario de REGISTRO ÚNICO
    registroForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('reg-nombre').value;
        const apellido = document.getElementById('reg-apellido').value;
        const email = document.getElementById('reg-email').value;
        const password = document.getElementById('reg-password').value;
        const rol = registroTipoInput.value;
        const especialidad = document.getElementById('reg-especialidad').value;
        
        if (pacientes.some(p => p.email === email) || medicos.some(m => m.email === email)) {
            alert('❌ El correo electrónico ya está registrado.');
            return;
        }
        
        let nuevoId = 1;
        
        if (rol === 'medico') {
            nuevoId = medicos.length > 0 ? Math.max(...medicos.map(m => m.id)) + 1 : 1;
            medicos.push({ id: nuevoId, nombre, apellido, email, password, especialidad: especialidad || 'General' });
            alert(`✅ ¡Registro de Médico exitoso! Bienvenido Dr./Dra. ${apellido}. Puede iniciar sesión.`);
        } else {
            nuevoId = pacientes.length > 0 ? Math.max(...pacientes.map(p => p.id)) + 1 : 1;
            pacientes.push({ id: nuevoId, nombre, apellido, email, password });
            alert(`✅ ¡Registro de Paciente exitoso! Bienvenido(a) ${nombre}. Puede iniciar sesión.`);
        }

        guardarDatos();
        e.target.reset();
        registerModal.style.display = 'none';
        loginModal.style.display = 'flex'; // Llevar al usuario al login
    });

    // --- LÓGICA DEL DASHBOARD DE PACIENTE (El resto de funciones se mantienen igual) ---

    // Las funciones `cargarPerfilPaciente`, `cargarHistorial`, `verificarRecordatorios`, 
    // `renderMetricGraphs`, `cargarFormularioDocumentosHTML`, etc., permanecen igual 
    // que en la versión anterior para no extender el código innecesariamente.
    // Solo se aseguran de que sean llamadas correctamente en `cargarHistorial` y `mostrarDashboard`.

    // --- INICIALIZACIÓN ---
    cargarDatosGuardados();
    
    if (window.location.pathname.endsWith('pacientes.html')) {
        if (usuarioActual && tipoUsuario) {
            mostrarDashboard(tipoUsuario);
        } else {
            window.location.href = 'index.html';
        }
    }
});

// El resto de la lógica del dashboard (Métricas, Citas, etc.) no se incluye aquí para brevedad,
// pero asumo que ya está presente en el archivo script.js del usuario.