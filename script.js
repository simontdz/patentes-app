document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const brandSelect = document.getElementById('brand');
    const customBrandGroup = document.getElementById('custom-brand-group');
    const customBrandInput = document.getElementById('custom-brand');
    const logoUpload = document.getElementById('logo-upload');
    const licenseNumberInput = document.getElementById('license-number');
    const spacingInput = document.getElementById('spacing');
    const spacingValue = document.getElementById('spacing-value');
    const sizeInput = document.getElementById('size');
    const sizeValue = document.getElementById('size-value');
    const brandSizeInput = document.getElementById('brand-size');
    const brandSizeValue = document.getElementById('brand-size-value');
    const downloadBtn = document.getElementById('download-btn');
    const previewLogoContainer = document.getElementById('preview-logo-container');
    const previewBrand = document.getElementById('preview-brand');
    const previewNumber = document.getElementById('preview-number');
    const previewChassis = document.getElementById('preview-chassis');
    const licenseContent = document.getElementById('license-content');
    const printBtn = document.getElementById('print-btn');
    const mirrorBtn = document.getElementById('mirror-btn');
    const licensePreview = document.getElementById('license-preview');
    const logoScaleInput = document.getElementById('logo-scale');
    const logoScaleValue = document.getElementById('logo-scale-value');
    const chassisGroup = document.getElementById('chassis-group');
    const chassisNumberInput = document.getElementById('chassis-number');
    const toggleChassisBtn = document.getElementById('toggle-chassis');
    const chassisSizeInput = document.getElementById('chassis-size');
    const chassisSizeValue = document.getElementById('chassis-size-value');

    let logoUrl = null;
    let isMirrored = false;

    // Modo espejo
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
            customBrandInput.focus();
        } else {
            customBrandGroup.classList.add('hidden');
        }
        updatePreview();
    });

    // Mostrar/ocultar campo de chasis
    toggleChassisBtn.addEventListener('click', function() {
        chassisGroup.classList.toggle('hidden');
        if (chassisGroup.classList.contains('hidden')) {
            this.textContent = '+ Agregar número de chasis';
            previewChassis.textContent = '';
        } else {
            this.textContent = '- Ocultar número de chasis';
            chassisNumberInput.focus();
        }
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
                
                img.onload = function() {
                    const scale = parseInt(logoScaleInput.value) / 100;
                    applyLogoScale(img, scale);
                    previewLogoContainer.appendChild(img);
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Función para escalar el logo
    function applyLogoScale(img, scale) {
        const maxWidth = 250 * scale;
        const maxHeight = 80 * scale;
        
        const ratio = Math.min(
            maxWidth / img.naturalWidth,
            maxHeight / img.naturalHeight
        );
        
        img.style.width = (img.naturalWidth * ratio) + 'px';
        img.style.height = (img.naturalHeight * ratio) + 'px';
        img.style.maxWidth = '90%';
        img.style.maxHeight = '90%';
    }

    // Actualizar valores de los ranges
    spacingInput.addEventListener('input', function() {
        spacingValue.textContent = this.value + ' px';
        licenseContent.style.gap = this.value + 'px';
    });

    sizeInput.addEventListener('input', function() {
        sizeValue.textContent = this.value + ' px';
        previewNumber.style.fontSize = this.value + 'px';
    });

    brandSizeInput.addEventListener('input', function() {
        brandSizeValue.textContent = this.value + ' px';
        previewBrand.style.fontSize = this.value + 'px';
    });

    chassisSizeInput.addEventListener('input', function() {
        chassisSizeValue.textContent = this.value + ' px';
        previewChassis.style.fontSize = this.value + 'px';
    });

    // Actualizar vista previa cuando cambian los valores
    licenseNumberInput.addEventListener('input', function() {
        previewNumber.textContent = this.value.toUpperCase();
    });

    chassisNumberInput.addEventListener('input', function() {
        previewChassis.textContent = this.value.toUpperCase();
    });

    customBrandInput.addEventListener('input', updatePreview);
    brandSelect.addEventListener('change', updatePreview);

    function updatePreview() {
        const brand = brandSelect.value === 'OTRA' 
            ? customBrandInput.value.toUpperCase() 
            : brandSelect.value;

        previewBrand.textContent = brand || '';
        previewBrand.style.display = brand ? 'block' : 'none';
    }

    // Controlador para el tamaño del logo
    logoScaleInput.addEventListener('input', function() {
        logoScaleValue.textContent = this.value + '%';
        if (previewLogoContainer.firstChild) {
            const scale = parseInt(this.value) / 100;
            applyLogoScale(previewLogoContainer.firstChild, scale);
        }
    });

    // Descargar la patente como imagen
    downloadBtn.addEventListener('click', function() {
        // Crear clon para la captura
        const clone = licensePreview.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        clone.style.backgroundColor = 'white';
        clone.style.padding = '20px';
        document.body.appendChild(clone);

        // Aplicar modo espejo si está activo
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

    // Función de impresión
    printBtn.addEventListener('click', function() {
        const printWindow = window.open('', '_blank');
        
        // Clonar el elemento para imprimir
        const clone = licensePreview.cloneNode(true);
        clone.style.backgroundColor = 'white';
        clone.style.padding = '20px';
        
        // Aplicar modo espejo si está activo
        if (isMirrored) {
            clone.classList.add('mirror-mode');
        }

        // Estilos CSS para la impresión
        const styles = `
            <style>
                @page { margin: 0; size: auto; }
                body { 
                    margin: 0; 
                    padding: 2mm; 
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
                    padding: 2mm !important;
                    width: 100% !important;
                    height: auto !important;
                }
                #preview-brand, #preview-number, #preview-chassis {
                    color: black !important;
                }
                #preview-brand {
                    font-size: 25mm !important;
                    margin: 1mm 0 !important;
                }
                #preview-number {
                    font-size: 30mm !important;
                    margin: 1mm 0 !important;
                }
                #preview-chassis {
                    font-size: 12mm !important;
                    margin: 1mm 0 !important;
                }
                #preview-logo-container {
                    max-height: 25mm !important;
                    margin: 1mm 0 !important;
                }
                #preview-logo-container img {
                    max-height: 25mm !important;
                }
                .mirror-mode {
                    transform: scaleX(-1) !important;
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
    previewNumber.style.fontSize = sizeInput.value + 'px';
    previewBrand.style.fontSize = brandSizeInput.value + 'px';
    previewChassis.style.fontSize = chassisSizeInput.value + 'px';

    // Ajustes iniciales para los controles
    spacingInput.value = 5;
    spacingValue.textContent = '5 px';

    sizeInput.value = 80;
    sizeValue.textContent = '80 px';

    brandSizeInput.value = 48;
    brandSizeValue.textContent = '48 px';

    logoScaleInput.value = 100;
    logoScaleValue.textContent = '100%';

    chassisSizeInput.value = 24;
    chassisSizeValue.textContent = '24 px';
});