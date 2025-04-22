document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const brandSelect = document.getElementById('brand');
    const customBrandGroup = document.getElementById('custom-brand-group');
    const logoUpload = document.getElementById('logo-upload');
    const licenseNumberInput = document.getElementById('license-number');
    const spacingInput = document.getElementById('spacing');
    const spacingValue = document.getElementById('spacing-value');
    const sizeInput = document.getElementById('size');
    const sizeValue = document.getElementById('size-value');
    const downloadBtn = document.getElementById('download-btn');
    const previewLogoContainer = document.getElementById('preview-logo-container');
    const previewBrand = document.getElementById('preview-brand');
    const previewNumber = document.getElementById('preview-number');
    const licenseContent = document.querySelector('.license-content');
    const printBtn = document.getElementById('print-btn');
    const mirrorBtn = document.getElementById('mirror-btn');
    const licensePreview = document.getElementById('license-preview');

    // Variables para control de escala del logo
    const logoScaleInput = document.getElementById('logo-scale');
    const logoScaleValue = document.getElementById('logo-scale-value');

    let logoUrl = null;
    let isMirrored = false;

    // Modo espejo mejorado
    mirrorBtn.addEventListener('click', function() {
        isMirrored = !isMirrored;
        if (isMirrored) {
            licensePreview.classList.add('mirror-mode');
            mirrorBtn.textContent = 'MODO NORMAL';
        } else {
            licensePreview.classList.remove('mirror-mode');
            mirrorBtn.textContent = 'MODO ESPEJO';
        }
    });

    // Modo oscuro/claro
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        themeToggle.textContent = '☀️';
    }

    // Mostrar/ocultar campo de marca personalizada
    brandSelect.addEventListener('change', function() {
        if (this.value === 'OTRA') {
            customBrandGroup.classList.remove('hidden');
        } else {
            customBrandGroup.classList.add('hidden');
        }
        updatePreview();
    });

    // Cargar logo
    logoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        previewLogoContainer.innerHTML = '';
        logoUrl = null;

        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                logoUrl = event.target.result;
                const img = document.createElement('img');
                img.src = logoUrl;
                // Ajustar tamaño inicial del logo
                const scale = parseInt(logoScaleInput.value) / 100;
                img.style.width = (150 * scale) + 'px';
                img.style.height = (80 * scale) + 'px';
                img.style.objectFit = 'contain';
                previewLogoContainer.appendChild(img);
                updatePreview();
            };
            reader.readAsDataURL(file);
        }
    });

    // Actualizar valores de los ranges
    spacingInput.addEventListener('input', function() {
        spacingValue.textContent = this.value + ' px';
        licenseContent.style.gap = this.value + 'px';
    });

    sizeInput.addEventListener('input', function() {
        sizeValue.textContent = this.value + ' px';
        previewBrand.style.fontSize = (parseInt(this.value) * 0.75) + 'px';
        previewNumber.style.fontSize = this.value + 'px';
    });

    // Actualizar vista previa cuando cambia el número de patente
    licenseNumberInput.addEventListener('input', function() {
        previewNumber.textContent = this.value.toUpperCase();
    });

    // Actualizar vista previa cuando cambia la marca
    document.getElementById('custom-brand').addEventListener('input', function() {
        updatePreview();
    });

    // Función para actualizar la marca en la vista previa
    function updatePreview() {
        const brand = brandSelect.value === 'OTRA' 
            ? document.getElementById('custom-brand').value.toUpperCase() 
            : brandSelect.value;

        previewBrand.textContent = brand || '';
        previewBrand.style.display = brand ? 'block' : 'none';
    }

    // Descargar la patente como imagen (mejorado para modo espejo)
    downloadBtn.addEventListener('click', function() {
        html2canvas(licensePreview, {
            scale: 2,
            backgroundColor: null,
            logging: false,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'patente-' + licenseNumberInput.value + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error('Error al generar la imagen:', err);
            alert('Ocurrió un error al generar la imagen. Inténtalo de nuevo.');
        });
    });

    // Controlador para el tamaño del logo (escala)
    logoScaleInput.addEventListener('input', function() {
        logoScaleValue.textContent = this.value + '%';
        if (previewLogoContainer.firstChild) {
            const scale = parseInt(this.value) / 100;
            previewLogoContainer.firstChild.style.width = (150 * scale) + 'px';
            previewLogoContainer.firstChild.style.height = (80 * scale) + 'px';
        }
    });

    // Función de impresión mejorada con modo espejo y fuente Arial
    printBtn.addEventListener('click', function() {
        const printWindow = window.open('', '_blank');
        
        // Clonar el elemento para imprimir manteniendo los estilos
        const clone = licensePreview.cloneNode(true);
        
        // Asegurarse de que el clon tenga los estilos correctos
        clone.style.backgroundColor = 'white';
        clone.style.padding = '30px';
        clone.style.margin = '0 auto';
        
        // Aplicar transformación de espejo si está activado
        if (isMirrored) {
            clone.classList.add('mirror-mode');
        }
        
        // Estilos CSS para la impresión
        const styles = `
            <style>
                @page { margin: 0; size: auto; }
                body { 
                    margin: 0; 
                    padding: 20px; 
                    font-family: Arial, sans-serif;
                    font-size: 12px;
                    display: flex; 
                    justify-content: center; 
                    background-color: white !important;
                }
                .license-preview { 
                    background-color: white !important;
                    color: black !important;
                }
                #preview-brand, #preview-number {
                    color: black !important;
                }
                .mirror-mode {
                    transform: scaleX(-1);
                }
                .mirror-mode * {
                    transform: scaleX(-1);
                }
            </style>
        `;
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Imprimir Patente</title>
                ${styles}
            </head>
            <body>
                ${clone.outerHTML}
                <script>
                    window.onload = function() {
                        setTimeout(function() {
                            window.print();
                            window.close();
                        }, 200);
                    };
                </script>
            </body>
            </html>
        `);
        printWindow.document.close();
    });

    // Inicializar vista previa
    updatePreview();
    licenseContent.style.gap = spacingInput.value + 'px';
    previewBrand.style.fontSize = (parseInt(sizeInput.value) * 0.75) + 'px';
    previewNumber.style.fontSize = sizeInput.value + 'px';

    // Ajustes iniciales para los controles de escala y tamaño
    // Range de spacing
    spacingInput.min = 0;
    spacingInput.max = 30;
    spacingInput.value = 10;

    // Range de tamaño
    sizeInput.min = 10;
    sizeInput.max = 48;
    sizeInput.value = 24;
});