document.addEventListener('DOMContentLoaded', () => {
    // Elementos del DOM
    const loginBtn = document.getElementById('btn-login');
    const registerBtn = document.getElementById('btn-register');
    const loginModal = document.getElementById('login-modal');
    const medicoDashboard = document.getElementById('medico-dashboard');
    const pacienteDashboard = document.getElementById('paciente-dashboard');
    const loginForm = document.getElementById('login-form');
    const pacienteForm = document.getElementById('paciente-form');
    const pacientesList = document.getElementById('pacientes-list');
    const perfilInfo = document.getElementById('perfil-info');
    const historialInfo = document.getElementById('historial-info');

    // Variables de estado
    let usuarioActual = null;
    let tipoUsuario = null;
    let pacientes = [];

    // Funciones de acceso
    function mostrarDashboard(tipo) {
        medicoDashboard.style.display = 'none';
        pacienteDashboard.style.display = 'none';
        
        if (tipo === 'medico') {
            medicoDashboard.style.display = 'block';
            cargarPacientes();
        } else {
            pacienteDashboard.style.display = 'block';
            cargarPerfilPaciente();
            cargarHistorial();
        }
    }

    function ocultarDashboards() {
        medicoDashboard.style.display = 'none';
        pacienteDashboard.style.display = 'none';
    }

    // Funciones de gestión de pacientes
    function agregarPaciente(paciente) {
        pacientes.push(paciente);
        guardarPacientes();
        cargarPacientes();
    }

    function editarPaciente(index, datosActualizados) {
        pacientes[index] = { ...pacientes[index], ...datosActualizados };
        guardarPacientes();
        cargarPacientes();
    }

    function eliminarPaciente(index) {
        pacientes.splice(index, 1);
        guardarPacientes();
        cargarPacientes();
    }

    function cargarPacientes() {
        pacientesList.innerHTML = '';
        pacientes.forEach((paciente, index) => {
            const pacienteElement = document.createElement('div');
            pacienteElement.className = 'paciente-item';
            pacienteElement.innerHTML = `
                <h3>${paciente.nombre} ${paciente.apellido}</h3>
                <p>Email: ${paciente.email}</p>
                <div class="acciones">
                    <button onclick="editarPaciente(${index})">Editar</button>
                    <button onclick="eliminarPaciente(${index})">Eliminar</button>
                </div>
            `;
            pacientesList.appendChild(pacienteElement);
        });
    }

    function cargarPerfilPaciente() {
        const paciente = pacientes.find(p => p.email === usuarioActual);
        if (paciente) {
            perfilInfo.innerHTML = `
                <h2>Mi Perfil</h2>
                <p>Nombre: ${paciente.nombre}</p>
                <p>Apellido: ${paciente.apellido}</p>
                <p>Email: ${paciente.email}</p>
            `;
        }
    }

    function cargarHistorial() {
        const paciente = pacientes.find(p => p.email === usuarioActual);
        if (paciente) {
            historialInfo.innerHTML = `
                <h2>Historial Médico</h2>
                <p>Paciente: ${paciente.nombre} ${paciente.apellido}</p>
                <div id="historial-detalle"></div>
            `;
        }
    }

    // Eventos de acceso
    loginBtn.addEventListener('click', () => {
        loginModal.style.display = 'flex';
    });

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        
        try {
            if (email && password) {
                usuarioActual = email;
                tipoUsuario = email.includes('medico') ? 'medico' : 'paciente';
                loginModal.style.display = 'none';
                mostrarDashboard(tipoUsuario);
            } else {
                alert('Por favor, ingrese sus credenciales');
            }
        } catch (error) {
            console.error('Error en el login:', error);
            alert('Error al iniciar sesión. Intente nuevamente.');
        }
    });

    // Eventos de gestión de pacientes
    document.getElementById('paciente-form').addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email-paciente').value;

        if (nombre && apellido && email) {
            agregarPaciente({
                nombre,
                apellido,
                email,
                fechaCreacion: new Date().toISOString()
            });
            
            // Limpiar el formulario
            e.target.reset();
        }
    });

    // Persistencia de datos
    function guardarPacientes() {
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
    }

    function cargarPacientesGuardados() {
        const datosGuardados = localStorage.getItem('pacientes');
        if (datosGuardados) {
            pacientes = JSON.parse(datosGuardados);
        }
    }

    // Cargar datos al iniciar
    cargarPacientesGuardados();
});