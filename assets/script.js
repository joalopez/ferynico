document.addEventListener('DOMContentLoaded', function() {
    
    // Lógica del Modal RSVP (NUEVO)
    const modal = document.getElementById("rsvp-modal");
    const rsvpButtons = document.querySelectorAll(".rsvp-btn"); // Selecciona todos los botones con esta clase
    const closeButton = document.querySelector(".close-button");

    // Función para abrir el modal
    rsvpButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault(); // Previene la acción por defecto del enlace/botón
            modal.style.display = "block";
        });
    });

    // Función para cerrar con el botón X
    closeButton.addEventListener('click', function() {
        modal.style.display = "none";
    });

    // Función para cerrar al hacer clic fuera del modal
    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    });

    // Lógica simple de envío de formulario (reemplazar con lógica real de servidor)
    /* const rsvpForm = document.getElementById('rsvp-form');
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('¡Confirmación enviada con éxito! (Esto es solo una simulación)');
            modal.style.display = "none";
        });
    } */

    // Lógica del Lightbox de Galería (NUEVO)
    const lightboxModal = document.getElementById("lightbox-modal");
    const lightboxImage = document.getElementById("lightbox-image");
    const lightboxTriggers = document.querySelectorAll(".gallery-trigger");
    const lightboxCloseButton = document.querySelector(".lightbox-close-button");

    // 1. Abrir el Lightbox
    lightboxTriggers.forEach(image => {
        image.addEventListener('click', function() {
            // Carga la URL de la imagen grande desde el atributo data-src
            const largeImageSrc = this.getAttribute('data-src');
            lightboxImage.src = largeImageSrc;
            lightboxModal.style.display = "flex"; // Usamos flex para centrar

            // **DETENER EL SLIDER AL ABRIR EL LIGHTBOX**
        stopAutoplay();
        });
    });

    // 2. Cerrar con el botón X
    lightboxCloseButton.addEventListener('click', function() {
        lightboxModal.style.display = "none";

        // **REANUDAR EL SLIDER AL CERRAR EL LIGHTBOX**
        startAutoplay();
    });

    // 3. Cerrar al hacer clic en el fondo oscuro
    window.addEventListener('click', function(event) {
        if (event.target == lightboxModal) {
            lightboxModal.style.display = "none";

            // **REANUDAR EL SLIDER AL CERRAR FUERA DEL MODAL**
            startAutoplay();
        }
    });

    // Lógica del SLIDER de Galería (MODIFICADA para múltiples imágenes por vista y desplazamiento de 1 en 1)
    const sliderTrack = document.querySelector('.slider-track');
    let sliderItems = Array.from(document.querySelectorAll('.slider-item')); // Convertir a array para mutaciones
    const prevButton = document.querySelector('.slider-button.prev');
    const nextButton = document.querySelector('.slider-button.next');
    
    if (!sliderTrack || sliderItems.length === 0) return;

    const originalTotalItems = sliderItems.length; // Número original de imágenes

    let currentIndex = 0; // Índice de la primera imagen visible
    let itemsPerView = 3; // Por defecto para mobile
    let gap = 15; // Gap definido en CSS

    // Función para obtener el ancho de un solo item (incluyendo su gap si aplica)
    function getItemWidth() {
        const itemElement = sliderItems[0];
        // Calcula el ancho real de un item visible, incluyendo el gap a la derecha
        return itemElement.offsetWidth + gap; 
    }

    function updateItemsPerView() {
        if (window.innerWidth >= 768) { // Punto de quiebre de desktop
            itemsPerView = 4;
        } else {
            itemsPerView = 3;
        }
    }

    // Clonar items para el loop infinito
    function setupClones() {
        // Limpiar clones existentes si los hay (para resize)
        sliderTrack.innerHTML = '';
        sliderItems.forEach(item => sliderTrack.appendChild(item)); // Re-añadir originales

        // Clonamos los primeros 'itemsPerView' items y los añadimos al final
        for (let i = 0; i < itemsPerView; i++) {
            const clone = sliderItems[i].cloneNode(true);
            sliderTrack.appendChild(clone);
        }
        // Clonamos los últimos 'itemsPerView' items y los añadimos al principio
        for (let i = originalTotalItems - itemsPerView; i < originalTotalItems; i++) {
            const clone = sliderItems[i].cloneNode(true);
            sliderTrack.prepend(clone);
        }
        // Volver a obtener la lista de todos los items (originales + clones)
        sliderItems = Array.from(document.querySelectorAll('.slider-item'));
        
        // El índice inicial debe apuntar al primer grupo de originales
        currentIndex = itemsPerView; 
        updateSliderPosition(false); // No animar el salto inicial
    }

    function updateSliderPosition(animate = true) {
        if (animate) {
            sliderTrack.style.transition = 'transform 0.5s ease-in-out';
        } else {
            sliderTrack.style.transition = 'none';
        }
        // El desplazamiento se basa en el currentIndex * el ancho de UN item
        sliderTrack.style.transform = `translateX(-${currentIndex * getItemWidth()}px)`;
    }

    function goToNextSlide() {
        currentIndex++;
        updateSliderPosition();

        // Si llega a un clon al final, salta al primer original sin transición
        if (currentIndex >= originalTotalItems + itemsPerView) {
            setTimeout(() => {
                currentIndex = itemsPerView; // Apunta al primer set de originales
                updateSliderPosition(false); // Sin animación
            }, 500); // Espera que la transición termine
        }
    }

    function goToPrevSlide() {
        currentIndex--;
        updateSliderPosition();

        // Si llega a un clon al principio, salta al último original sin transición
        if (currentIndex < 0) {
            setTimeout(() => {
                currentIndex = originalTotalItems - 1 + itemsPerView; // Apunta al último set de originales
                updateSliderPosition(false); // Sin animación
            }, 500); // Espera que la transición termine
        }
    }

    prevButton.addEventListener('click', goToPrevSlide);
    nextButton.addEventListener('click', goToNextSlide);

    // Inicializar el slider al cargar la página y al redimensionar
    updateItemsPerView();
    setupClones();

    window.addEventListener('resize', () => {
        updateItemsPerView();
        setupClones(); // Re-clonar y re-posicionar para el nuevo número de items visibles
    });

    // Delegar los eventos de click para el lightbox a los items clonados también
    sliderTrack.addEventListener('click', function(e) {
        if (e.target.classList.contains('gallery-trigger')) {
            const largeImageSrc = e.target.getAttribute('data-src');
            lightboxImage.src = largeImageSrc;
            lightboxModal.style.display = "flex";
        }
    });

    // 1. Declaramos la variable globalmente o dentro de este alcance
    let autoplayInterval; 

    // 2. Creamos una función para iniciar el autoplay
    function startAutoplay() {
        // Configuramos la función para llamar a goToNextSlide() cada 3000ms
        autoplayInterval = setInterval(goToNextSlide, 3000); 
    }

    // 3. Creamos una función para detener el autoplay
    function stopAutoplay() {
        clearInterval(autoplayInterval);
    }
    
    // 4. Inicializamos el autoplay al cargar la página
    startAutoplay(); 

    // Opcional: Ajustar el slider si cambia el tamaño de la ventana (mantener)
    window.addEventListener('resize', () => {
        // ...
    });
});

window.addEventListener("load", function() {
  const form = document.getElementById('rsvp-form');
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    const data = new FormData(form);
    const action = e.target.action;
    fetch(action, {
      method: 'POST',
      body: data,
    })
    .then(() => {
      alert("Enviado con exito! Muchas gracias.");
    })
  });
});
