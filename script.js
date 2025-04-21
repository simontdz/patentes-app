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
    const logoWidthInput = document.getElementById('logo-width');
    const logoHeightInput = document.getElementById('logo-height');
    const logoWidthValue = document.getElementById('logo-width-value');
    const logoHeightValue = document.getElementById('logo-height-value');
    const printBtn = document.getElementById('print-btn');

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
                img.style.maxWidth = logoWidthInput.value + 'px';
                img.style.maxHeight = logoHeightInput.value + 'px';
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

    // Controladores para el tamaño del logo
    logoWidthInput.addEventListener('input', function() {
        logoWidthValue.textContent = this.value + ' px';
        if (previewLogoContainer.firstChild) {
            previewLogoContainer.firstChild.style.maxWidth = this.value + 'px';
        }
    });
    
    logoHeightInput.addEventListener('input', function() {
        logoHeightValue.textContent = this.value + ' px';
        if (previewLogoContainer.firstChild) {
            previewLogoContainer.firstChild.style.maxHeight = this.value + 'px';
        }
    });

    // Función de impresión mejorada
    printBtn.addEventListener('click', function() {
        const licensePreview = document.querySelector('.license-preview');
        const printWindow = window.open('', '_blank');
        
        printWindow.document.write(`
            <!DOCTYPE html>
            <html>
            <head>
                <title>Imprimir Patente</title>
                <style>
                    body { margin: 0; padding: 20px; display: flex; justify-content: center; }
                    .license-preview { padding: 30px; text-align: center; background-color: white; }
                    #preview-brand { font-size: ${previewBrand.style.fontSize}; font-weight: bold; }
                    #preview-number { font-size: ${previewNumber.style.fontSize}; font-weight: bold; letter-spacing: 2px; }
                    #preview-logo-container img {
                        max-width: ${logoWidthInput.value}px;
                        max-height: ${logoHeightInput.value}px;
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
});