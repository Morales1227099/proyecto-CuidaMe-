document.addEventListener('DOMContentLoaded', () => {
    // --- Referencias del DOM y variables de estado ---
    const loginBtn = document.getElementById('btn-login');
    const loginBtnMain = document.getElementById('btn-login-main');
    const loginModal = document.getElementById('login-modal');
    const closeLoginModal = document.getElementById('close-login-modal');
    const loginForm = document.getElementById('login-form');
    
    // Variables de Estado que usan localStorage para simular un Backend
    let usuarioActual = localStorage.getItem('usuarioActual') || null; 
    let tipoUsuario = localStorage.getItem('tipoUsuario') || null;
    
    let pacientes = [];
    let medicos = []; 
    let citas = [];    
    let metricas = []; 

    // --- UTILITIES: PERSISTENCIA (localStorage) ---
    function guardarDatos() {
        localStorage.setItem('pacientes', JSON.stringify(pacientes));
        localStorage.setItem('medicos', JSON.stringify(medicos));
        localStorage.setItem('citas', JSON.stringify(citas));
        localStorage.setItem('metricas', JSON.stringify(metricas));
    }

    function cargarDatosGuardados() {
        const datosPacientes = localStorage.getItem('pacientes');
        const datosMedicos = localStorage.getItem('medicos');
        const datosCitas = localStorage.getItem('citas');
        const datosMetricas = localStorage.getItem('metricas');

        if (datosPacientes) pacientes = JSON.parse(datosPacientes);
        if (datosMedicos) medicos = JSON.parse(datosMedicos);
        if (datosCitas) citas = JSON.parse(datosCitas);
        if (datosMetricas) metricas = JSON.parse(datosMetricas);

        // Datos de ejemplo iniciales (Médicos) para que el formulario de cita funcione
        if (medicos.length === 0) {
            medicos.push({ id: 1, nombre: 'Dr. Alejandro Soto', especialidad: 'Cardiología', email: 'alejandro@cuidame.com' });
            medicos.push({ id: 2, nombre: 'Dra. María Paz', especialidad: 'Pediatría', email: 'maria@cuidame.com' });
            guardarDatos();
        }
    }
    
    // --- UTILITIES: REDIRECCIÓN y DASHBOARD ---
    function iniciarSesionYRedirigir(email, tipo) {
        localStorage.setItem('usuarioActual', email);
        localStorage.setItem('tipoUsuario', tipo);
        window.location.href = 'pacientes.html'; 
    }

    function mostrarDashboard(tipo) {
        // Esta función solo se ejecuta en pacientes.html
        const medicoDashboard = document.getElementById('medico-dashboard');
        const pacienteDashboard = document.getElementById('paciente-dashboard');
        
        if (!medicoDashboard || !pacienteDashboard) return; // Si no estamos en el dashboard
        
        medicoDashboard.style.display = 'none';
        pacienteDashboard.style.display = 'none';
        
        if (tipo === 'medico') {
            medicoDashboard.style.display = 'block';
            cargarPacientes();
        } else if (tipo === 'paciente') {
            pacienteDashboard.style.display = 'block';
            cargarPerfilPaciente();
            cargarHistorial(); // La función clave que muestra Citas y Métricas
        }
    }

    // --- LÓGICA DE LOGIN ---
    loginBtn?.addEventListener('click', () => { loginModal.style.display = 'flex'; });
    loginBtnMain?.addEventListener('click', () => { loginModal.style.display = 'flex'; });
    closeLoginModal?.addEventListener('click', () => { loginModal.style.display = 'none'; });
    loginModal?.addEventListener('click', (e) => {
        if (e.target === loginModal) loginModal.style.display = 'none';
    });

    loginForm?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const emailInput = document.getElementById('email').value;
        const passwordInput = document.getElementById('password').value;
        
        // Credenciales Demo Médico
        if (emailInput === 'medico@cuidame.com' && passwordInput === 'pass') {
            iniciarSesionYRedirigir(emailInput, 'medico');
            return;
        } 
        
        // Búsqueda de Paciente
        const pacienteEncontrado = pacientes.find(p => p.email === emailInput && p.password === passwordInput);
        if (pacienteEncontrado) {
            iniciarSesionYRedirigir(emailInput, 'paciente');
            return;
        }

        alert('Credenciales incorrectas. (Recuerda que los pacientes tienen la contraseña "pass" por defecto en esta demo)');
    });

    // Manejo de Registro Médico (Solo registra pacientes en esta demo)
    document.getElementById('btn-register')?.addEventListener('click', () => {
        alert('El registro es exclusivo para Médicos. Por favor, inicie sesión como Médico para registrar nuevos pacientes.');
        loginModal.style.display = 'flex';
    });


    // --- LÓGICA DEL DASHBOARD DE MÉDICO ---

    function cargarPacientes() {
        const pacientesList = document.getElementById('pacientes-list');
        if (!pacientesList) return;

        pacientesList.innerHTML = '';
        if (pacientes.length === 0) {
            pacientesList.innerHTML = '<p>No hay pacientes registrados.</p>';
            return;
        }
        
        pacientes.forEach((paciente, index) => {
            const pacienteElement = document.createElement('div');
            pacienteElement.className = 'paciente-item';
            pacienteElement.innerHTML = `
                <div>
                    <h3>${paciente.nombre} ${paciente.apellido}</h3>
                    <p>Email: ${paciente.email}</p>
                </div>
                <div class="acciones">
                    <button class="btn-primary" onclick="window.verDetallePaciente(${paciente.id})">Ver Detalles</button>
                    <button class="btn-delete" onclick="window.eliminarPacienteHandler(${paciente.id})">Eliminar</button>
                </div>
            `;
            pacientesList.appendChild(pacienteElement);
        });
    }

    document.getElementById('paciente-form')?.addEventListener('submit', (e) => {
        e.preventDefault();
        
        const nombre = document.getElementById('nombre').value;
        const apellido = document.getElementById('apellido').value;
        const email = document.getElementById('email-paciente').value;
        
        // Generar un ID simple y asignamos contraseña 'pass'
        const nuevoId = pacientes.length > 0 ? Math.max(...pacientes.map(p => p.id)) + 1 : 1;
        
        pacientes.push({
            id: nuevoId,
            nombre,
            apellido,
            email,
            password: 'pass', 
        });
        guardarDatos();
        cargarPacientes();
        e.target.reset();
        alert(`Paciente ${nombre} ${apellido} registrado. Contraseña: pass`);
    });

    // Hacemos funciones globales para que los botones onclick de HTML funcionen
    window.eliminarPacienteHandler = (id) => {
        const index = pacientes.findIndex(p => p.id === id);
        if (index > -1 && confirm(`¿Seguro que desea eliminar al paciente ID ${id}?`)) {
            pacientes.splice(index, 1);
            guardarDatos();
            cargarPacientes();
            alert('Paciente eliminado.');
        }
    };
    window.verDetallePaciente = (id) => { 
        alert(`Funcionalidad de ver perfil detallado (ID: ${id}) no implementada aún, pero los datos de citas y métricas están listos para ser mostrados.`); 
    };

    // --- LÓGICA DEL DASHBOARD DE PACIENTE (El corazón de Cuídame) ---

    function cargarPerfilPaciente() {
        const paciente = pacientes.find(p => p.email === usuarioActual);
        const perfilInfo = document.getElementById('perfil-info');
        if (!paciente || !perfilInfo) return;
        
        perfilInfo.innerHTML = `
            <h3>Bienvenido(a), ${paciente.nombre}!</h3>
            <p><strong>Email:</strong> ${paciente.email}</p>
            <p><strong>ID de Paciente:</strong> ${paciente.id}</p>
            <button class="btn-secondary" onclick="alert('Funcionalidad para cambiar la contraseña no implementada en esta demo.')">Cambiar Contraseña</button>
        `;
    }

    function cargarHistorial() {
        const paciente = pacientes.find(p => p.email === usuarioActual);
        const historialInfo = document.getElementById('historial-info');
        if (!paciente || !historialInfo) return;

        // Inyectar la estructura completa: Citas, Métricas y Contenedores de Historial
        historialInfo.innerHTML = `
            <h2>🗓️ Citas y Recordatorios</h2>
            <section class="citas-section">
                ${cargarFormularioCitasHTML()}
                <ul id="citas-list"></ul>
            </section>
            
            <h2>🩺 Seguimiento de Métricas Vitales</h2>
            <section class="metricas-section">
                ${cargarFormularioMetricasHTML()}
                <ul id="metricas-list"></ul>
            </section>
        `;
        
        // Renderizar y asignar eventos
        renderizarCitas(paciente.id);
        renderizarMetricas(paciente.id);
        asignarEventosFormularios(paciente.id);
    }
    
    function cargarFormularioCitasHTML() {
        const medicoOptions = medicos.map(m => `<option value="${m.id}">${m.nombre} (${m.especialidad})</option>`).join('');
        return `
            <form id="cita-form">
                <h4>Agendar Nueva Cita</h4>
                <div class="form-group"><label for="cita-fecha">Fecha y Hora:</label><input type="datetime-local" id="cita-fecha" required></div>
                <div class="form-group"><label for="cita-medico">Médico:</label><select id="cita-medico" required><option value="">Seleccione un Médico</option>${medicoOptions}</select></div>
                <div class="form-group"><label for="cita-motivo">Motivo:</label><input type="text" id="cita-motivo" required placeholder="Ej: Control de rutina"></div>
                <button type="submit" class="btn-accent">Agendar Cita</button>
            </form>
        `;
    }

    function cargarFormularioMetricasHTML() {
        return `
            <form id="metricas-form">
                <h4>Registrar Nueva Métrica</h4>
                <div class="form-group">
                    <label for="metrica-tipo">Métrica a Registrar:</label>
                    <select id="metrica-tipo" required>
                        <option value="PA">Presión Arterial (PA)</option>
                        <option value="Glucosa">Glucosa (mg/dL)</option>
                        <option value="Peso">Peso (kg)</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="metrica-valor1" id="label-valor1">Valor Principal (Sistólica para PA / Valor único):</label>
                    <input type="number" id="metrica-valor1" required>
                </div>
                <div class="form-group" id="metrica-valor2-group" style="display: none;">
                    <label for="metrica-valor2">Valor Secundario (Diastólica):</label>
                    <input type="number" id="metrica-valor2">
                </div>
                <button type="submit" class="btn-accent">Registrar Métrica</button>
            </form>
        `;
    }
    
    function renderizarCitas(pacienteId) {
        const citasUsuario = citas.filter(c => c.pacienteId === pacienteId).sort((a,b) => new Date(a.fecha) - new Date(b.fecha));
        const citasList = document.getElementById('citas-list');
        
        citasList.innerHTML = citasUsuario.map(c => {
            const medico = medicos.find(m => m.id === parseInt(c.medicoId));
            const fechaHora = new Date(c.fecha).toLocaleString('es-ES', { dateStyle: 'short', timeStyle: 'short' });
            return `<li>**${fechaHora}** | ${c.motivo} con ${medico ? medico.nombre : 'N/A'}</li>`;
        }).join('') || '<li>No hay citas programadas.</li>';
    }

    function renderizarMetricas(pacienteId) {
        const metricasUsuario = metricas.filter(m => m.pacienteId === pacienteId).sort((a,b) => new Date(b.fecha) - new Date(a.fecha));
        const metricasList = document.getElementById('metricas-list');

        metricasList.innerHTML = metricasUsuario.map(m => {
            const fecha = new Date(m.fecha).toLocaleDateString();
            let valor = `${m.valor1} ${m.tipo === 'Peso' ? 'kg' : 'mg/dL'}`;
            if (m.tipo === 'PA') valor = `${m.valor1}/${m.valor2} mmHg`;
            return `<li>${fecha} | **${m.tipo}**: ${valor}</li>`;
        }).join('') || '<li>No hay métricas registradas.</li>';
    }

    function asignarEventosFormularios(pacienteId) {
        // Evento de cambio para Presión Arterial (PA)
        document.getElementById('metrica-tipo')?.addEventListener('change', (e) => {
            const isPA = e.target.value === 'PA';
            document.getElementById('metrica-valor2-group').style.display = isPA ? 'block' : 'none';
            document.getElementById('metrica-valor2').required = isPA;
            document.getElementById('label-valor1').textContent = isPA ? 'Valor Principal (Sistólica):' : 'Valor:';
        });

        // Evento: Registrar Métrica
        document.getElementById('metricas-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const tipo = document.getElementById('metrica-tipo').value;
            const valor1 = document.getElementById('metrica-valor1').value;
            const valor2 = tipo === 'PA' ? document.getElementById('metrica-valor2').value : null;

            if (tipo === 'PA' && (!valor1 || !valor2)) { alert('Debe ingresar ambos valores para la Presión Arterial.'); return; }

            metricas.push({
                id: metricas.length > 0 ? Math.max(...metricas.map(m => m.id)) + 1 : 1,
                pacienteId: pacienteId,
                fecha: new Date().toISOString(),
                tipo: tipo,
                valor1: valor1,
                valor2: valor2
            });
            guardarDatos();
            renderizarMetricas(pacienteId); 
            e.target.reset();
        });

        // Evento: Agendar Cita
        document.getElementById('cita-form')?.addEventListener('submit', (e) => {
            e.preventDefault();
            citas.push({
                id: citas.length > 0 ? Math.max(...citas.map(c => c.id)) + 1 : 1,
                pacienteId: pacienteId,
                fecha: document.getElementById('cita-fecha').value,
                medicoId: document.getElementById('cita-medico').value,
                motivo: document.getElementById('cita-motivo').value
            });
            guardarDatos();
            renderizarCitas(pacienteId);
            e.target.reset();
        });
    }

    // --- INICIALIZACIÓN ---
    cargarDatosGuardados();
    
    // Si estamos en el dashboard (pacientes.html), intentamos cargar la vista
    if (window.location.pathname.endsWith('pacientes.html')) {
        if (usuarioActual && tipoUsuario) {
            mostrarDashboard(tipoUsuario);
        } else {
            // Si no hay sesión, regresamos al index
            window.location.href = 'index.html';
        }
    }
});