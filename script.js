document.addEventListener('DOMContentLoaded', function() {
    // Elementos del DOM
    const body = document.body;
    const themeToggle = document.getElementById('theme-toggle');
    const brandSelect = document.getElementById('brand');
    const customBrandGroup = document.getElementById('custom-brand-group');
    const logoUpload = document.getElementById('logo-upload');
    const generateBtn = document.getElementById('generate-btn');
    const previewSection = document.getElementById('preview-section');
    const licensePreview = document.getElementById('license-preview');
    const downloadBtn = document.getElementById('download-btn');
    const spacingInput = document.getElementById('spacing');
    const spacingValue = document.getElementById('spacing-value');
    const sizeInput = document.getElementById('size');
    const sizeValue = document.getElementById('size-value');
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetZoomBtn = document.getElementById('reset-zoom');
    
    let currentScale = 1;
    let logoUrl = null;
    
    // Modo oscuro/claro
    themeToggle.addEventListener('click', function() {
        body.classList.toggle('dark-mode');
        body.classList.toggle('light-mode');
        themeToggle.textContent = body.classList.contains('dark-mode') ? '☀️' : '🌙';
        
        // Guardar preferencia en localStorage
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
    });
    
    // Cargar logo
    logoUpload.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = function(event) {
                logoUrl = event.target.result;
            };
            reader.readAsDataURL(file);
        }
    });
    
    // Actualizar valores de los ranges
    spacingInput.addEventListener('input', function() {
        spacingValue.textContent = this.value + ' px';
    });
    
    sizeInput.addEventListener('input', function() {
        sizeValue.textContent = this.value + '%';
    });
    
    // Generar la patente
    generateBtn.addEventListener('click', function() {
        const brand = brandSelect.value === 'OTRA' 
            ? document.getElementById('custom-brand').value.toUpperCase() 
            : brandSelect.value;
        
        const licenseNumber = document.getElementById('license-number').value.toUpperCase();
        const fontStyle = document.getElementById('font-style').value;
        const spacing = spacingInput.value;
        const size = sizeInput.value / 100;
        
        if (!licenseNumber) {
            alert('Por favor ingresa un número de patente');
            return;
        }
        
        // Generar el HTML de la patente
        let licenseHTML = '';
        
        if (logoUrl) {
            licenseHTML += `<img src="${logoUrl}" class="license-logo" alt="Logo">`;
        }
        
        if (brand) {
            licenseHTML += `
                <div class="license-brand" style="font-style: ${fontStyle.includes('italic') ? 'italic' : 'normal'}; 
                                          font-weight: ${fontStyle.includes('bold') ? 'bold' : 'normal'};
                                          letter-spacing: ${spacing}px;
                                          font-size: ${24 * size}px">
                    ${brand}
                </div>`;
        }
        
        licenseHTML += `
            <div class="license-number" style="font-style: ${fontStyle.includes('italic') ? 'italic' : 'normal'}; 
                                      font-weight: ${fontStyle.includes('bold') ? 'bold' : 'normal'};
                                      letter-spacing: ${spacing}px;
                                      font-size: ${32 * size}px">
                ${licenseNumber}
            </div>`;
        
        licensePreview.innerHTML = licenseHTML;
        previewSection.classList.remove('hidden');
        currentScale = 1;
        licensePreview.style.transform = `scale(${currentScale})`;
    });
    
    // Controles de zoom
    zoomInBtn.addEventListener('click', function() {
        currentScale *= 1.1;
        licensePreview.style.transform = `scale(${currentScale})`;
    });
    
    zoomOutBtn.addEventListener('click', function() {
        currentScale *= 0.9;
        licensePreview.style.transform = `scale(${currentScale})`;
    });
    
    resetZoomBtn.addEventListener('click', function() {
        currentScale = 1;
        licensePreview.style.transform = `scale(${currentScale})`;
    });
    
    // Descargar la patente como imagen
    downloadBtn.addEventListener('click', function() {
        html2canvas(licensePreview, {
            scale: 2,
            backgroundColor: null,
            logging: false,
            useCORS: true
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'patente-' + document.getElementById('license-number').value + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        }).catch(err => {
            console.error('Error al generar la imagen:', err);
            alert('Ocurrió un error al generar la imagen. Inténtalo de nuevo.');
        });
    });
});