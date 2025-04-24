document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const elements = {
        body: document.body,
        themeToggle: document.getElementById('theme-toggle'),
        brandSelect: document.getElementById('brand'),
        customBrandGroup: document.getElementById('custom-brand-group'),
        customBrandInput: document.getElementById('custom-brand'),
        logoUpload: document.getElementById('logo-upload'),
        licenseNumberInput: document.getElementById('license-number'),
        spacingInput: document.getElementById('spacing'),
        spacingValue: document.getElementById('spacing-value'),
        sizeInput: document.getElementById('size'),
        sizeValue: document.getElementById('size-value'),
        brandSizeInput: document.getElementById('brand-size'),
        brandSizeValue: document.getElementById('brand-size-value'),
        downloadBtn: document.getElementById('download-btn'),
        previewLogoContainer: document.getElementById('preview-logo-container'),
        previewBrand: document.getElementById('preview-brand'),
        previewNumber: document.getElementById('preview-number'),
        previewChassis: document.getElementById('preview-chassis'),
        licenseContent: document.getElementById('license-content'),
        printBtn: document.getElementById('print-btn'),
        mirrorBtn: document.getElementById('mirror-btn'),
        licensePreview: document.getElementById('license-preview'),
        logoScaleInput: document.getElementById('logo-scale'),
        logoScaleValue: document.getElementById('logo-scale-value'),
        chassisGroup: document.getElementById('chassis-group'),
        chassisNumberInput: document.getElementById('chassis-number'),
        toggleChassisBtn: document.getElementById('toggle-chassis'),
        chassisSizeInput: document.getElementById('chassis-size'),
        chassisSizeValue: document.getElementById('chassis-size-value')
    };

    // Estado de la aplicación
    const state = {
        logoUrl: null,
        isMirrored: false,
        currentTheme: localStorage.getItem('theme') || 'light'
    };

    // Inicialización
    function init() {
        setupEventListeners();
        applySavedTheme();
        setInitialValues();
        updatePreview();
    }

    // Configurar event listeners
    function setupEventListeners() {
        // Toggle de tema
        elements.themeToggle.addEventListener('click', toggleTheme);

        // Selector de marca
        elements.brandSelect.addEventListener('change', handleBrandChange);

        // Toggle de chasis
        elements.toggleChassisBtn.addEventListener('click', toggleChassisField);

        // Upload de logo
        elements.logoUpload.addEventListener('change', handleLogoUpload);

        // Input ranges
        elements.spacingInput.addEventListener('input', updateSpacing);
        elements.sizeInput.addEventListener('input', updateLicenseSize);
        elements.brandSizeInput.addEventListener('input', updateBrandSize);
        elements.chassisSizeInput.addEventListener('input', updateChassisSize);
        elements.logoScaleInput.addEventListener('input', updateLogoScale);

        // Inputs de texto
        elements.licenseNumberInput.addEventListener('input', updateLicenseNumber);
        elements.chassisNumberInput.addEventListener('input', updateChassisNumber);
        elements.customBrandInput.addEventListener('input', updatePreview);

        // Botones de acción
        elements.mirrorBtn.addEventListener('click', toggleMirrorMode);
        elements.printBtn.addEventListener('click', printLicense);
        elements.downloadBtn.addEventListener('click', downloadLicense);
    }

    // Funciones de manejo de eventos
    function toggleTheme() {
        state.currentTheme = state.currentTheme === 'light' ? 'dark' : 'light';
        applyTheme();
        localStorage.setItem('theme', state.currentTheme);
    }

    function handleBrandChange() {
        if (this.value === 'OTRA') {
            elements.customBrandGroup.classList.remove('hidden');
            elements.customBrandInput.focus();
        } else {
            elements.customBrandGroup.classList.add('hidden');
        }
        updatePreview();
    }

    function toggleChassisField() {
        elements.chassisGroup.classList.toggle('hidden');
        if (elements.chassisGroup.classList.contains('hidden')) {
            this.textContent = '+ Agregar número de chasis';
            elements.previewChassis.textContent = '';
        } else {
            this.textContent = '- Ocultar número de chasis';
            elements.chassisNumberInput.focus();
        }
    }

    function handleLogoUpload(e) {
        const file = e.target.files[0];
        elements.previewLogoContainer.innerHTML = '';
        state.logoUrl = null;

        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                state.logoUrl = event.target.result;
                const img = document.createElement('img');
                img.src = state.logoUrl;
                
                img.onload = function() {
                    applyLogoScale(img, parseInt(elements.logoScaleInput.value) / 100);
                    elements.previewLogoContainer.appendChild(img);
                };
            };
            reader.readAsDataURL(file);
        }
    }

    // Funciones de actualización
    function updateSpacing() {
        const value = this.value;
        elements.spacingValue.textContent = `${value} px`;
        elements.licenseContent.style.gap = `${value}px`;
    }

    function updateLicenseSize() {
        const value = this.value;
        elements.sizeValue.textContent = `${value} px`;
        elements.previewNumber.style.fontSize = `${value}px`;
        
        // Ajustar letter-spacing dinámicamente
        const spacing = Math.min(3 + (value / 40), 8);
        elements.previewNumber.style.letterSpacing = `${spacing}px`;
    }

    function updateBrandSize() {
        const value = this.value;
        elements.brandSizeValue.textContent = `${value} px`;
        elements.previewBrand.style.fontSize = `${value}px`;
    }

    function updateChassisSize() {
        const value = this.value;
        elements.chassisSizeValue.textContent = `${value} px`;
        elements.previewChassis.style.fontSize = `${value}px`;
    }

    function updateLogoScale() {
        const value = this.value;
        elements.logoScaleValue.textContent = `${value}%`;
        
        if (elements.previewLogoContainer.firstChild) {
            applyLogoScale(elements.previewLogoContainer.firstChild, value / 100);
        }
    }

    function updateLicenseNumber() {
        elements.previewNumber.textContent = this.value.toUpperCase();
    }

    function updateChassisNumber() {
        elements.previewChassis.textContent = this.value.toUpperCase();
    }

    function updatePreview() {
        const brand = elements.brandSelect.value === 'OTRA' 
            ? elements.customBrandInput.value.toUpperCase() 
            : elements.brandSelect.value;

        elements.previewBrand.textContent = brand || '';
        elements.previewBrand.style.display = brand ? 'block' : 'none';
    }

    // Funciones de utilidad
    function applyLogoScale(img, scale) {
        const maxWidth = 250 * scale;
        const maxHeight = 80 * scale;
        
        const ratio = Math.min(
            maxWidth / img.naturalWidth,
            maxHeight / img.naturalHeight
        );
        
        img.style.width = `${img.naturalWidth * ratio}px`;
        img.style.height = `${img.naturalHeight * ratio}px`;
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
    }

    function toggleMirrorMode() {
        state.isMirrored = !state.isMirrored;
        if (state.isMirrored) {
            elements.licensePreview.classList.add('mirror-mode');
            elements.mirrorBtn.textContent = 'MODO NORMAL';
        } else {
            elements.licensePreview.classList.remove('mirror-mode');
            elements.mirrorBtn.textContent = 'MODO ESPEJO';
        }
    }

    // Funciones de acciones
    function printLicense() {
        const printWindow = window.open('', '_blank');
        const clone = elements.licensePreview.cloneNode(true);
        
        // Aplicar modo espejo si está activo
        if (state.isMirrored) {
            clone.classList.add('mirror-mode');
        }

        const styles = `
            <style>
                @page { size: auto; margin: 0mm; }
                body { margin: 0; padding: 0; }
                .license-preview { 
                    width: 100% !important; 
                    height: 100% !important;
                    padding: 10mm !important;
                    display: flex !important;
                    justify-content: center !important;
                    align-items: center !important;
                }
                .license-content { 
                    width: 100% !important;
                    gap: 2mm !important;
                }
                #preview-brand { font-size: 35mm !important; margin: 1mm 0 !important; }
                #preview-number { 
                    font-size: 45mm !important; 
                    margin: 1mm 0 !important;
                    letter-spacing: 2mm !important;
                    white-space: nowrap !important;
                    transform: scale(0.95) !important;
                    transform-origin: center !important;
                }
                #preview-chassis { font-size: 15mm !important; margin: 1mm 0 !important; }
                #preview-logo-container { max-height: 25mm !important; margin-bottom: 2mm !important; }
                #preview-logo-container img { max-height: 25mm !important; }
                .mirror-mode { transform: scaleX(-1) !important; }
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
    }

    function downloadLicense() {
        const clone = elements.licensePreview.cloneNode(true);
        clone.style.position = 'fixed';
        clone.style.left = '-9999px';
        clone.style.backgroundColor = 'white';
        clone.style.padding = '20px';
        document.body.appendChild(clone);

        if (state.isMirrored) {
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
            link.download = `patente-${elements.licenseNumberInput.value || 'generada'}.png`;
            link.href = canvas.toDataURL('image/png');
            link.click();
            document.body.removeChild(clone);
        }).catch(err => {
            console.error('Error al generar la imagen:', err);
            alert('Ocurrió un error al generar la imagen. Inténtalo de nuevo.');
            document.body.removeChild(clone);
        });
    }

    // Funciones de inicialización
    function applySavedTheme() {
        if (state.currentTheme === 'dark') {
            elements.body.classList.add('dark-mode');
            elements.themeToggle.textContent = '☀️';
        } else {
            elements.body.classList.remove('dark-mode');
            elements.themeToggle.textContent = '🌙';
        }
    }

    function applyTheme() {
        if (state.currentTheme === 'dark') {
            elements.body.classList.add('dark-mode');
            elements.themeToggle.textContent = '☀️';
        } else {
            elements.body.classList.remove('dark-mode');
            elements.themeToggle.textContent = '🌙';
        }
    }

    function setInitialValues() {
        // Valores iniciales para los ranges
        elements.spacingInput.value = 5;
        elements.spacingValue.textContent = '5 px';
        elements.licenseContent.style.gap = '5px';

        elements.sizeInput.value = 100;
        elements.sizeValue.textContent = '100 px';
        elements.previewNumber.style.fontSize = '100px';
        elements.previewNumber.style.letterSpacing = '5px';

        elements.brandSizeInput.value = 60;
        elements.brandSizeValue.textContent = '60 px';
        elements.previewBrand.style.fontSize = '60px';

        elements.logoScaleInput.value = 100;
        elements.logoScaleValue.textContent = '100%';

        elements.chassisSizeInput.value = 24;
        elements.chassisSizeValue.textContent = '24 px';
        elements.previewChassis.style.fontSize = '24px';
    }

    // Iniciar la aplicación
    init();
});