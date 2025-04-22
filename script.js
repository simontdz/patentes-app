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
    const orientationSelect = document.getElementById('orientation');
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

    // Cambiar orientación
    orientationSelect.addEventListener('change', function() {
        if (this.value === 'vertical') {
            licenseContent.classList.add('vertical-mode');
        } else {
            licenseContent.classList.remove('vertical-mode');
        }
    });

    // Modo oscuro/claro
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
        localStorage.setItem('theme', body.classList.contains('dark-mode') ? 'dark' : 'light');
    });

    // Cargar tema guardado
    const savedTheme = localStorage.getItem('theme') || 'light';
    if (savedTheme === 'dark') {
        body.classList.add('dark-mode');
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

    // Cargar logo con mejor manejo de dimensiones
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
                
                // Esperar a que la imagen cargue para obtener dimensiones originales
                img.onload = function() {
                    const scale = parseInt(logoScaleInput.value) / 100;
                    const aspectRatio = img.naturalWidth / img.naturalHeight;
                    const maxHeight = 100; // Altura máxima base
                    
                    // Aplicar escala manteniendo proporciones
                    img.style.maxHeight = (maxHeight * scale) + 'px';
                    img.style.width = 'auto';
                    img.style.height = 'auto';
                    img.style.objectFit = 'contain';
                    
                    previewLogoContainer.appendChild(img);
                    updatePreview();
                };
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

    // Controlador para el tamaño del logo (escala)
    logoScaleInput.addEventListener('input', function() {
        logoScaleValue.textContent = this.value + '%';
        if (previewLogoContainer.firstChild) {
            const scale = parseInt(this.value) / 100;
            const img = previewLogoContainer.firstChild;
            const maxHeight = 100; // Altura máxima base
            
            // Aplicar escala manteniendo proporciones
            img.style.maxHeight = (maxHeight * scale) + 'px';
            img.style.width = 'auto';
            img.style.height = 'auto';
        }
    });

    // Descargar la patente como imagen (mejorado para modo espejo y orientación)
    downloadBtn.addEventListener('click', function() {
        // Clonamos el elemento para no afectar la visualización actual
        const clone = licensePreview.cloneNode(true);
        clone.style.position = 'absolute';
        clone.style.left = '-9999px';
        document.body.appendChild(clone);

        // Aplicamos estilos necesarios para la captura
        clone.style.backgroundColor = 'white';
        clone.style.padding = '30px';
        clone.style.margin = '0 auto';
        
        // Si está en modo espejo, aplicamos la transformación al clon
        if (isMirrored) {
            clone.classList.add('mirror-mode');
        }

        html2canvas(clone, {
            scale: 2,
            backgroundColor: null,
            logging: false,
            useCORS: true,
            allowTaint: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'patente-' + licenseNumberInput.value + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
            document.body.removeChild(clone);
        }).catch(err => {
            console.error('Error al generar la imagen:', err);
            alert('Ocurrió un error al generar la imagen. Inténtalo de nuevo.');
            document.body.removeChild(clone);
        });
    });

    // Función de impresión mejorada
    printBtn.addEventListener('click', function() {
        const printWindow = window.open('', '_blank');
        
        // Clonar el elemento para imprimir
        const clone = licensePreview.cloneNode(true);
        
        // Aplicar estilos necesarios
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
                    display: flex; 
                    justify-content: center; 
                    align-items: center;
                    min-height: 100vh;
                    background-color: white !important;
                }
                .license-preview { 
                    background-color: white !important;
                    color: black !important;
                    box-shadow: none !important;
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
                .vertical-mode .license-content {
                    flex-direction: row !important;
                    gap: 30px !important;
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

    // Ajustes iniciales para los controles
    spacingInput.min = 0;
    spacingInput.max = 100;
    spacingInput.value = 20;

    sizeInput.min = 12;
    sizeInput.max = 120;
    sizeInput.value = 48;

    logoScaleInput.min = 10;
    logoScaleInput.max = 300;
    logoScaleInput.value = 100;
});