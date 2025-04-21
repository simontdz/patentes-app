document.addEventListener('DOMContentLoaded', function() {
    // Elementos del formulario
    const brandSelect = document.getElementById('brand');
    const customBrandGroup = document.getElementById('custom-brand-group');
    const generateBtn = document.getElementById('generate-btn');
    const previewSection = document.getElementById('preview-section');
    const licensePreview = document.getElementById('license-preview');
    const downloadBtn = document.getElementById('download-btn');
    
    // Controles de espaciado y tamaño
    const spacingInput = document.getElementById('spacing');
    const spacingValue = document.getElementById('spacing-value');
    const sizeInput = document.getElementById('size');
    const sizeValue = document.getElementById('size-value');
    
    // Controles de zoom
    const zoomInBtn = document.getElementById('zoom-in');
    const zoomOutBtn = document.getElementById('zoom-out');
    const resetZoomBtn = document.getElementById('reset-zoom');
    
    let currentScale = 1;
    
    // Mostrar/ocultar campo de marca personalizada
    brandSelect.addEventListener('change', function() {
        if (this.value === 'OTRA') {
            customBrandGroup.classList.remove('hidden');
        } else {
            customBrandGroup.classList.add('hidden');
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
        const exposition = document.getElementById('exposition').value;
        const spacing = spacingInput.value;
        const size = sizeInput.value / 100; // Convertir porcentaje a factor
        
        if (!licenseNumber) {
            alert('Por favor ingresa un número de patente');
            return;
        }
        
        // Generar el HTML de la patente
        licensePreview.innerHTML = `
            <div class="license-brand" style="font-style: ${fontStyle.includes('italic') ? 'italic' : 'normal'}; 
                                      font-weight: ${fontStyle.includes('bold') ? 'bold' : 'normal'};
                                      letter-spacing: ${spacing}px;
                                      font-size: ${24 * size}px">
                ${brand}
            </div>
            <div class="license-number" style="font-style: ${fontStyle.includes('italic') ? 'italic' : 'normal'}; 
                                      font-weight: ${fontStyle.includes('bold') ? 'bold' : 'normal'};
                                      letter-spacing: ${spacing}px;
                                      font-size: ${32 * size}px">
                ${licenseNumber}
            </div>
            ${exposition ? `<div class="license-details" style="font-size: ${16 * size}px">Exposición: ${exposition}</div>` : ''}
        `;
        
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
        // Crear un canvas de la patente para descargar como imagen
        html2canvas(licensePreview, {
            scale: 2, // Mayor calidad
            backgroundColor: null // Fondo transparente
        }).then(canvas => {
            const link = document.createElement('a');
            link.download = 'patente-' + document.getElementById('license-number').value + '.png';
            link.href = canvas.toDataURL('image/png');
            link.click();
        });
    });
});