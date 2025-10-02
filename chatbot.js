document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatbotWindow = document.getElementById("chatbot-window");
    const messagesDiv = document.getElementById("chatbot-messages");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Base de conocimiento completa de Cuídame
    const baseConocimiento = {
      citas_y_recordatorios: {
        "agendar cita": "Para agendar una cita, ve a la sección 'Gestión de Salud', abre el formulario de 'Citas' y presiona el botón 'Agendar'.",
        "modificar cita": "Busca la cita en la lista y usa la opción 'Modificar'. Por ahora, solo puedes ver la lista de citas agendadas.",
        "recordatorios": "Los recordatorios te avisan a las horas programadas. ¡Mantén las notificaciones activas para no olvidar nada!",
        "cancelar cita": "Selecciona la cita en el listado y usa la opción 'Cancelar'."
      },
      historial_medico: {
        "guarda historial": "Tu historial almacena diagnósticos, tratamientos previos, resultados de laboratorio, cirugías, alergias y vacunas. Todo está seguro y centralizado.",
        "subir resultados": "¡Sí! En la sección 'Historial' podrás cargar documentos o imágenes de tus exámenes. (Funcionalidad para la siguiente fase).",
        "datos son seguros": "Absolutamente. Todos tus datos están cifrados. Tu privacidad es nuestra máxima prioridad.",
      },
      medicamentos: {
        "agregar medicamento": "Ve a la sección 'Medicamentos' y llena los campos (nombre, dosis, frecuencia). ¡Es muy fácil!",
        "dosis olvidada": "Registra una 'Dosis Olvidada'. Consulta con tu médico si te pasa seguido para reajustar horarios.",
        "que es la dosis": "La dosis es la cantidad exacta de medicamento que debes tomar en cada toma.",
        "que tomo": "La app no es un sustituto del diagnóstico médico. Consulta tu lista de medicamentos registrados o a tu médico."
      },
      metricas_vitales: {
        "registrar peso": "Puedes registrar tu peso y otras métricas en la sección 'Métricas Vitales' en el dashboard de paciente.",
        "presion arterial": "Usa la sección 'Métricas Vitales' para registrar tus valores sistólicos y diastólicos de la presión arterial (Ej: 120/80)."
      },
      general: {
        "que es cuidame": "Cuídame es tu plataforma personal para centralizar y organizar toda tu información médica (citas, historial, medicamentos) y tomar el control de tu bienestar.",
        "iniciar sesion": "Presiona el botón 'Iniciar Sesión' y usa tus credenciales. (Demo Médico: medico@cuidame.com / pass)",
      }
    };

    const saludos = ["hola", "buenos días", "saludos", "qué tal", "hey"];
    const despedidas = ["adiós", "chau", "hasta luego", "bye", "salir", "terminar"];

    function agregarMensaje(texto, clase) {
      const msg = document.createElement("div");
      msg.className = "msg " + clase;
      msg.innerHTML = texto; 
      messagesDiv.appendChild(msg);
      messagesDiv.scrollTop = messagesDiv.scrollHeight;
    }

    function responder(pregunta) {
      const textoNormalizado = pregunta.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
      const palabrasUsuario = textoNormalizado.split(/\s+/).filter(w => w.length > 2);

      if (saludos.some(s => textoNormalizado.includes(s))) {
        return "¡Hola! 👋 Soy el Asistente de Cuídame. Pregúntame sobre **citas, medicamentos, historial o métricas vitales**.";
      }
      if (despedidas.some(d => textoNormalizado.includes(d))) {
        return "¡Adiós! 👋 Cuídate mucho. ¡Vuelve pronto!";
      }

      // Lógica de búsqueda mejorada (más tolerante a errores y orden)
      for (let categoria in baseConocimiento) {
        for (let clave in baseConocimiento[categoria]) {
          const claveNormalizada = clave.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
          const palabrasClave = claveNormalizada.split(/\s+/).filter(w => w.length > 2);
          
          // Verificar si al menos una palabra clave esencial está contenida en el input del usuario
          // o si el input contiene la frase completa con variaciones.
          if (textoNormalizado.includes(claveNormalizada) || palabrasClave.some(pk => textoNormalizado.includes(pk))) {
            const categoriaTitle = categoria.replace(/_/g, " ").toUpperCase();
            return `💡 [${categoriaTitle}] ${baseConocimiento[categoria][clave]}`; 
          }
        }
      }

      // Respuesta de fallback
      return "❓ No encuentro información sobre eso. Intenta usar palabras clave como: **citas, historial, medicamentos, peso o presión arterial**.";
    }

    sendBtn.addEventListener("click", () => {
      const texto = userInput.value.trim();
      if (!texto) return;
      agregarMensaje("🙋 " + texto, "user");
      const respuesta = responder(texto);
      setTimeout(() => agregarMensaje("🤖 " + respuesta, "bot"), 500); 
      userInput.value = "";
    });

    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter") sendBtn.click();
    });

    chatbotBtn.addEventListener("click", () => {
      const isVisible = chatbotWindow.style.display === "flex";
      chatbotWindow.style.display = isVisible ? "none" : "flex";
      
      if (!isVisible && messagesDiv.children.length === 0) {
          setTimeout(() => agregarMensaje("🤖 " + responder("hola"), "bot"), 100);
      }
    });
});