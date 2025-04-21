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

    // Variables para control de escala del logo
    const logoScaleInput = document.getElementById('logo-scale');
    const logoScaleValue = document.getElementById('logo-scale-value');

    let logoUrl = null;

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

    // Descargar la patente como imagen
    downloadBtn.addEventListener('click', function() {
        const licensePreview = document.querySelector('.license-preview');

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

    // Función de impresión mejorada
    printBtn.addEventListener('click', function() {
        const licensePreview = document.querySelector('.license-preview');
        const printWindow = window.open('', '_blank');

        // Obtener estilos dinámicos
        const brandFontSize = previewBrand.style.fontSize;
        const numberFontSize = previewNumber.style.fontSize;
        const logoMaxWidth = document.getElementById('logo-width') ? document.getElementById('logo-width').value : '150';
        const logoMaxHeight = document.getElementById('logo-height') ? document.getElementById('logo-height').value : '80';

        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Imprimir Patente</title>
                <style>
                    body { margin: 0; padding: 20px; display: flex; justify-content: center; }
                    .license-preview { padding: 30px; text-align: center; background-color: white; }
                    #preview-brand { font-size: ${brandFontSize}; font-weight: bold; }
                    #preview-number { font-size: ${numberFontSize}; font-weight: bold; letter-spacing: 2px; }
                    #preview-logo-container img {
                        max-width: ${logoMaxWidth}px;
                        max-height: ${logoMaxHeight}px;
                        object-fit: contain;
                    }
                </style>
            </head>
            <body>
                ${licensePreview.outerHTML}
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
    spacingInput.max = 30; // Reducido de 50
    spacingInput.value = 10; // Reducido de 20

    // Range de tamaño
    sizeInput.min = 10; // Reducido de 12
    sizeInput.max = 48; // Reducido de 72
    sizeInput.value = 24; // Reducido de 32
});