"use strict";

(function () {
  function iniciarMokki() {
    iniciarProductos();
    iniciarPortada();
    iniciarFormulario();
    iniciarNavegacion();
  }

  /* PORTADA: CINCO IMÁGENES, CAMBIO CADA TRES SEGUNDOS */
  function iniciarPortada() {
    const portada = document.getElementById("carruselPortada");

    if (!portada || !window.bootstrap || !window.bootstrap.Carousel) {
      return;
    }

    const preferencia = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    );

    const carrusel = window.bootstrap.Carousel.getOrCreateInstance(
      portada,
      {
        interval: 3000,
        pause: false,
        touch: false,
        keyboard: false,
        wrap: true
      }
    );

    let cursorEncima = portada.matches(":hover");
    let productoAbierto = false;

    function actualizarPortada() {
      const focoDentro = portada.contains(document.activeElement);

      if (
        preferencia.matches ||
        document.hidden ||
        cursorEncima ||
        focoDentro ||
        productoAbierto
      ) {
        carrusel.pause();
      } else {
        carrusel.cycle();
      }
    }

    portada.addEventListener("mouseenter", function () {
      cursorEncima = true;
      actualizarPortada();
    });

    portada.addEventListener("mouseleave", function () {
      cursorEncima = false;
      actualizarPortada();
    });

    portada.addEventListener("focusin", actualizarPortada);

    portada.addEventListener("focusout", function () {
      window.setTimeout(actualizarPortada, 0);
    });

    document.addEventListener(
      "visibilitychange",
      actualizarPortada
    );

    if (typeof preferencia.addEventListener === "function") {
      preferencia.addEventListener("change", actualizarPortada);
    }

    const ventanaProducto = document.getElementById("ventanaProducto");

    if (ventanaProducto) {
      ventanaProducto.addEventListener("show.bs.modal", function () {
        productoAbierto = true;
        actualizarPortada();
      });

      ventanaProducto.addEventListener("hidden.bs.modal", function () {
        productoAbierto = false;
        actualizarPortada();
      });
    }

    actualizarPortada();
  }

  /* FORMULARIO DE DEMOSTRACIÓN */
  function iniciarFormulario() {
    const formulario = document.getElementById("formularioContacto");
    const nombre = document.getElementById("nombre");
    const correo = document.getElementById("correo");
    const mensaje = document.getElementById("mensaje");
    const respuesta = document.getElementById("respuestaFormulario");

    if (!formulario || !nombre || !correo || !mensaje || !respuesta) {
      return;
    }

    formulario.addEventListener("submit", function (evento) {
      evento.preventDefault();

      nombre.setCustomValidity(
        nombre.value.trim() ? "" : "Escribí tu nombre."
      );

      mensaje.setCustomValidity(
        mensaje.value.trim() ? "" : "Escribí tu mensaje."
      );

      if (!formulario.reportValidity()) {
        return;
      }

      respuesta.textContent =
        "¡Gracias, " + nombre.value.trim() + "! " +
        "Este formulario es una demostración escolar. " +
        "Tu mensaje no se ha enviado.";

      formulario.reset();
    });

    formulario.addEventListener("input", function (evento) {
      if (typeof evento.target.setCustomValidity === "function") {
        evento.target.setCustomValidity("");
      }

      respuesta.textContent = "";
    });
  }

  /* NAVEGACIÓN EN CELULAR */
  function iniciarNavegacion() {
    const navegacion = document.getElementById("navegacion");

    if (!navegacion) {
      return;
    }

    navegacion.querySelectorAll(".nav-link").forEach(function (enlace) {
      enlace.addEventListener("click", function () {
        if (
          navegacion.classList.contains("show") &&
          window.bootstrap &&
          window.bootstrap.Collapse
        ) {
          window.bootstrap.Collapse.getOrCreateInstance(
            navegacion,
            { toggle: false }
          ).hide();
        }
      });
    });
  }

  /* BOTONES VER PRODUCTO Y VENTANA DE DETALLES */
  function iniciarProductos() {
    const tarjetas = document.querySelectorAll(
      ".producto, .tarjeta-producto"
    );

    if (
      tarjetas.length === 0 ||
      document.getElementById("ventanaProducto")
    ) {
      return;
    }

    const ventana = document.createElement("div");

    ventana.id = "ventanaProducto";
    ventana.className = "modal fade ventana-producto";
    ventana.tabIndex = -1;

    ventana.setAttribute("aria-labelledby", "tituloVentanaProducto");
    ventana.setAttribute("aria-hidden", "true");

    ventana.innerHTML = `
      <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
        <div class="modal-content">

          <div class="modal-header">
            <h2
              id="tituloVentanaProducto"
              class="modal-title fs-4"
            ></h2>

            <button
              type="button"
              class="btn-close"
              data-bs-dismiss="modal"
              aria-label="Cerrar"
            ></button>
          </div>

          <div class="modal-body">
            <div class="detalle-producto">

              <div>
                <img
                  id="fotoVentanaProducto"
                  class="foto-producto-completa"
                  alt=""
                  decoding="async"
                >
              </div>

              <div class="informacion-producto">
                <p
                  id="categoriaVentanaProducto"
                  class="etiqueta"
                ></p>

                <h3 class="mt-0">¿Qué lleva?</h3>
                <p id="descripcionVentanaProducto"></p>

                <p
                  id="precioVentanaProducto"
                  class="precio"
                ></p>

                <h3>La historia detrás del sabor</h3>
                <p
                  id="historiaVentanaProducto"
                  class="historia-producto"
                ></p>
              </div>

            </div>
          </div>

          <div class="modal-footer">
            <button
              type="button"
              class="btn boton-mokki"
              data-bs-dismiss="modal"
            >
              Volver al menú
            </button>
          </div>

        </div>
      </div>
    `;

    document.body.appendChild(ventana);

    const titulo = ventana.querySelector("#tituloVentanaProducto");
    const foto = ventana.querySelector("#fotoVentanaProducto");
    const categoria = ventana.querySelector("#categoriaVentanaProducto");
    const descripcion = ventana.querySelector("#descripcionVentanaProducto");
    const precio = ventana.querySelector("#precioVentanaProducto");
    const historia = ventana.querySelector("#historiaVentanaProducto");

    let botonOrigen = null;

    tarjetas.forEach(function (tarjeta) {
      const imagenTarjeta = tarjeta.querySelector("img");
      const nombreTarjeta = tarjeta.querySelector("h3, h5");
      const precioTarjeta = tarjeta.querySelector(".precio");

      const descripcionTarjeta = Array.from(
        tarjeta.querySelectorAll("p")
      ).find(function (parrafo) {
        return (
          !parrafo.classList.contains("precio") &&
          !parrafo.classList.contains("categoria") &&
          !parrafo.classList.contains("etiqueta")
        );
      });

      if (!imagenTarjeta || !nombreTarjeta) {
        return;
      }

      const grupo = tarjeta.closest(".accordion-item");

      const encabezadoGrupo = grupo
        ? grupo.querySelector(".accordion-button")
        : null;

      const etiquetaTarjeta = tarjeta.querySelector(".categoria");

      let nombreCategoria = "MOKKI";

      if (encabezadoGrupo) {
        nombreCategoria = encabezadoGrupo.textContent.trim();
      } else if (etiquetaTarjeta) {
        nombreCategoria = etiquetaTarjeta.textContent.trim();
      }

      const boton = document.createElement("button");

      boton.type = "button";
      boton.className = "boton-ver-producto";
      boton.textContent = "Ver producto";

      boton.setAttribute("aria-haspopup", "dialog");
      boton.setAttribute("aria-controls", "ventanaProducto");

      boton.setAttribute(
        "aria-label",
        "Ver foto y detalles de " + nombreTarjeta.textContent.trim()
      );

      const contenido = tarjeta.querySelector(".card-body") || tarjeta;
      contenido.appendChild(boton);

      boton.addEventListener("click", function () {
        if (!window.bootstrap || !window.bootstrap.Modal) {
          window.alert(
            "No se pudo cargar Bootstrap. Revisá tu conexión " +
            "a internet y recargá la página."
          );
          return;
        }

        botonOrigen = boton;

        const nombreProducto = nombreTarjeta.textContent.trim();

        titulo.textContent = nombreProducto;
        foto.src = imagenTarjeta.getAttribute("src");
        foto.alt = imagenTarjeta.alt || nombreProducto;
        categoria.textContent = nombreCategoria;

        descripcion.textContent = descripcionTarjeta
          ? descripcionTarjeta.textContent.trim()
          : "Descripción próximamente.";

        precio.textContent = precioTarjeta
          ? precioTarjeta.textContent.trim()
          : "";

        historia.textContent = crearHistoria(
          nombreProducto,
          nombreCategoria
        );

        ventana.querySelector(".modal-body").scrollTop = 0;

        window.bootstrap.Modal.getOrCreateInstance(ventana).show();
      });
    });

    ventana.addEventListener("hidden.bs.modal", function () {
      if (botonOrigen && botonOrigen.isConnected) {
        botonOrigen.focus();
      }
    });
  }

  /* HISTORIAS CREATIVAS PARA EL CONCEPTO FICTICIO DE MOKKI */
  function crearHistoria(nombre, categoria) {
    const tipo = categoria.toLowerCase();

    if (tipo.includes("cookies")) {
      return nombre + " se inspira en una pequeña tienda de cookies " +
        "entre las calles de Nueva York. En MOKKI imaginamos este " +
        "antojo como compañero de una bebida, una conversación " +
        "o una pausa dulce para vos.";
    }

    if (tipo.includes("pretzels")) {
      return nombre + " evoca un paseo por Nueva York con un pretzel " +
        "en la mano. Su historia en MOKKI acompaña recorridos, " +
        "encuentros y descansos: una manera de darle un giro a tu día.";
    }

    if (
      tipo.includes("croissants") ||
      tipo.includes("panadería")
    ) {
      return nombre + " se inspira en una mañana de cafetería: " +
        "el aroma del pan, una mesa junto a la ventana y la ciudad " +
        "moviéndose afuera. En MOKKI, esa escena se convierte " +
        "en una pausa para disfrutar.";
    }

    if (tipo.includes("bagels")) {
      return nombre + " evoca un desayuno antes de recorrer la ciudad. " +
        "Dentro del concepto de MOKKI, representa una buena " +
        "conversación y el primer momento agradable del día.";
    }

    if (tipo.includes("repostería")) {
      return nombre + " se inspira en las vitrinas de postres " +
        "que imaginamos encontrar durante un paseo por Nueva York. " +
        "Su historia termina en tu mesa, acompañando una tarde " +
        "o cerrando una comida con un pequeño gusto.";
    }

    if (tipo.includes("matcha")) {
      return nombre + " representa el lado tranquilo de MOKKI. " +
        "Imaginamos una pausa entre el movimiento de la ciudad, " +
        "con colores y sabores que invitan a disfrutar sin prisa.";
    }

    if (tipo.includes("cold brew")) {
      return nombre + " se inspira en una mañana urbana: calles " +
        "que despiertan y una bebida fría para acompañar el camino. " +
        "En MOKKI, es una invitación a encontrar tu propio ritmo.";
    }

    if (
      tipo.includes("tés") ||
      tipo.includes("té con leche")
    ) {
      return nombre + " nace de imaginar un descanso en un parque " +
        "de Nueva York. Un momento para respirar, conversar " +
        "y dejar que el sabor acompañe una pausa en tu día.";
    }

    if (
      tipo.includes("malteadas") ||
      tipo.includes("sin café")
    ) {
      return nombre + " celebra el lado divertido de la ciudad. " +
        "En MOKKI imaginamos una salida con amigos y una " +
        "conversación que convierte cualquier tarde " +
        "en un recuerdo especial.";
    }

    return nombre + " forma parte de nuestra interpretación " +
      "de Nueva York: movimiento, encuentros y pequeñas pausas. " +
      "En MOKKI lo imaginamos como compañero de una charla, " +
      "una idea nueva o un momento para ti.";
  }

  /* INICIAR CUANDO EL HTML ESTÉ LISTO */
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", iniciarMokki, {
      once: true
    });
  } else {
    iniciarMokki();
  }
})();