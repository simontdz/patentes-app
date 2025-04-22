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
    const licenseContent = document.getElementById('license-content');
    const printBtn = document.getElementById('print-btn');
    const mirrorBtn = document.getElementById('mirror-btn');
    const orientationBtn = document.getElementById('orientation-btn');
    const licensePreview = document.getElementById('license-preview');
    const logoScaleInput = document.getElementById('logo-scale');
    const logoScaleValue = document.getElementById('logo-scale-value');

    let logoUrl = null;
    let isMirrored = false;
    let isVertical = false;

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

    // Cambiar orientación
    orientationBtn.addEventListener('click', function() {
        isVertical = !isVertical;
        if (isVertical) {
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

    // Cargar logo con manejo de proporciones
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
                    updatePreview();
                };
            };
            reader.readAsDataURL(file);
        }
    });

    // Función para escalar el logo manteniendo proporciones
    function applyLogoScale(img, scale) {
        const maxWidth = 300 * scale;
        const maxHeight = 150 * scale;
        
        // Calcular dimensiones manteniendo aspect ratio
        const ratio = Math.min(
            maxWidth / img.naturalWidth,
            maxHeight / img.naturalHeight
        );
        
        img.style.width = (img.naturalWidth * ratio) + 'px';
        img.style.height = (img.naturalHeight * ratio) + 'px';
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
    }

    // Actualizar valores de los ranges
    spacingInput.addEventListener('input', function() {
        spacingValue.textContent = this.value + ' px';
        licenseContent.style.gap = this.value + 'px';
    });

    sizeInput.addEventListener('input', function() {
        sizeValue.textContent = this.value + ' px';
        previewBrand.style.fontSize = (parseInt(this.value) * 0.6) + 'px';
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
        clone.style.padding = '40px';
        document.body.appendChild(clone);

        // Aplicar orientación y modo espejo al clon
        if (isVertical) {
            clone.querySelector('.license-content').classList.add('vertical-mode');
        }
        if (isMirrored) {
            clone.classList.add('mirror-mode');
        }

        // Ajustar estilos para la captura
        const brandElement = clone.querySelector('#preview-brand');
        const numberElement = clone.querySelector('#preview-number');
        brandElement.style.fontSize = (parseInt(sizeInput.value) * 0.8) + 'px';
        numberElement.style.fontSize = (parseInt(sizeInput.value) * 1.2) + 'px';

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
        clone.style.backgroundColor = 'white';
        clone.style.padding = '40px';
        
        // Aplicar orientación y modo espejo al clon
        if (isVertical) {
            clone.querySelector('.license-content').classList.add('vertical-mode');
        }
        if (isMirrored) {
            clone.classList.add('mirror-mode');
        }

        // Ajustar tamaños para impresión
        const brandElement = clone.querySelector('#preview-brand');
        const numberElement = clone.querySelector('#preview-number');
        brandElement.style.fontSize = (parseInt(sizeInput.value) * 1.2) + 'px';
        numberElement.style.fontSize = (parseInt(sizeInput.value) * 1.8) + 'px';

        const logoImg = clone.querySelector('#preview-logo-container img');
        if (logoImg) {
            logoImg.style.maxHeight = '200px';
        }

        // Estilos CSS para la impresión
        const styles = `
            <style>
                @page { margin: 0; size: auto; }
                body { 
                    margin: 0; 
                    padding: 0; 
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
                    margin: 0 !important;
                    padding: 40px !important;
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
                .vertical-mode {
                    flex-direction: row !important;
                    gap: 60px !important;
                }
                #preview-logo-container img {
                    max-height: 200px !important;
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
    previewBrand.style.fontSize = (parseInt(sizeInput.value) * 0.6) + 'px';
    previewNumber.style.fontSize = sizeInput.value + 'px';

    // Ajustes iniciales para los controles
    spacingInput.min = 0;
    spacingInput.max = 100;
    spacingInput.value = 20;

    sizeInput.min = 12;
    sizeInput.max = 120;
    sizeInput.value = 60;

    logoScaleInput.min = 10;
    logoScaleInput.max = 300;
    logoScaleInput.value = 100;
});