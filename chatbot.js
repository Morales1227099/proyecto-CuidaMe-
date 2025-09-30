document.addEventListener('DOMContentLoaded', () => {
    // Referencias del DOM
    const chatbotBtn = document.getElementById("chatbot-btn");
    const chatbotWindow = document.getElementById("chatbot-window");
    const messagesDiv = document.getElementById("chatbot-messages");
    const userInput = document.getElementById("user-input");
    const sendBtn = document.getElementById("send-btn");

    // Base de conocimiento ampliada para Cuídame
    const baseConocimiento = {
      citas_y_recordatorios: {
        "agendar una nueva cita": "Para agendar una cita, ve a la sección 'Gestión de Salud', abre el formulario de 'Citas' y presiona el botón 'Agendar'.",
        "modificar una cita": "Busca la cita en la lista y usa la opción 'Modificar' o 'Editar' (funcionalidad no implementada en esta demo, pero disponible en el futuro).",
        "recordatorios": "Los recordatorios te avisan a las horas programadas. ¡Mantén las notificaciones activas para no olvidar tus dosis o citas!",
        "próxima cita": "Tu próxima cita se muestra en el panel principal. Las citas futuras están en la lista de 'Mis Citas'.",
        "cancelar una cita": "Selecciona la cita en el listado y usa la opción 'Cancelar'."
      },
      historial_medico: {
        "guarda mi historial": "Tu historial almacena diagnósticos, tratamientos previos, resultados de laboratorio, cirugías, alergias y vacunas.",
        "subir mis resultados": "¡Sí! En la sección 'Historial Médico' puedes cargar documentos o imágenes de tus exámenes. (Funcionalidad para la siguiente fase).",
        "registrar una alergia": "En el apartado 'Historial' > 'Alergias' puedes documentar cualquier reacción. Sé específico con la causa.",
        "información es segura": "Absolutamente. Todos tus datos están cifrados y protegidos. Tu privacidad es nuestra máxima prioridad."
      },
      medicamentos: {
        "agrego un medicamento": "Ve a la sección 'Medicamentos' y llena los campos (nombre, dosis, frecuencia y duración).",
        "olvidé una dosis": "Registra una 'Dosis Olvidada' en la app. Consulta con tu médico si sucede a menudo para reajustar horarios.",
        "qué es la dosis": "La dosis es la cantidad exacta de medicamento que debes tomar en cada toma (ej. 500 mg, 1 pastilla)."
      },
      metricas_vitales: {
        "registrar mi peso": "Puedes registrar tu peso y otras métricas en la sección 'Métricas Vitales' en el dashboard de paciente. Se registran automáticamente con la fecha actual.",
        "presión arterial": "Usa la sección 'Métricas Vitales' para registrar tus valores sistólicos y diastólicos de la presión arterial (Ej: 120/80)."
      },
      general: {
        "sirve esta aplicación": "La aplicación Cuídame centraliza y organiza tu información médica para que tomes el control total de tu salud.",
        "quién puede ver mis datos": "Solo tú y las personas a las que decidas darle acceso pueden ver tus datos. Son 100% privados.",
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
      const texto = pregunta.toLowerCase();

      if (saludos.some(s => texto.includes(s))) {
        return "¡Hola! 👋 Soy el Asistente de Cuídame. Pregúntame sobre **citas, historial, medicamentos o métricas vitales**.";
      }
      if (despedidas.some(d => texto.includes(d))) {
        return "¡Adiós! 👋 Cuídate mucho. ¡Vuelve pronto!";
      }

      for (let categoria in baseConocimiento) {
        for (let clave in baseConocimiento[categoria]) {
          // Lógica de búsqueda simple (includes)
          if (texto.includes(clave)) {
            const categoriaTitle = categoria.replace(/_/g, " ").toUpperCase();
            return `💡 [${categoriaTitle}] ${baseConocimiento[categoria][clave]}`; 
          }
        }
      }

      return "❓ No encuentro información sobre eso. Intenta preguntarme sobre **citas, historial médico, medicamentos o métricas vitales**.";
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
      
      // Saludo automático al abrir el bot por primera vez
      if (!isVisible && messagesDiv.children.length === 0) {
          setTimeout(() => agregarMensaje("🤖 " + responder("hola"), "bot"), 100);
      }
    });
});