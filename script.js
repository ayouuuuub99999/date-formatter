// Fonction formatDate améliorée
function formatDate(date, format = 'YYYY-MM-DD') {
    // Gérer les chaînes de caractères au format DD/MM/YYYY
    let dateObj;
    
    if (typeof date === 'string' && date.includes('/')) {
        // Convertir le format DD/MM/YYYY en Date valide
        const parts = date.split(/[/ :]/);
        if (parts.length >= 3) {
            const day = parseInt(parts[0], 10);
            const month = parseInt(parts[1], 10) - 1; // Les mois sont 0-based
            const year = parseInt(parts[2], 10);
            const hours = parts[3] ? parseInt(parts[3], 10) : 0;
            const minutes = parts[4] ? parseInt(parts[4], 10) : 0;
            
            dateObj = new Date(year, month, day, hours, minutes);
        } else {
            dateObj = new Date(date);
        }
    } else {
        dateObj = new Date(date);
    }
    
    // Vérifier si la date est valide
    if (isNaN(dateObj.getTime())) {
        throw new Error('Date invalide');
    }

    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    return format
        .replace('YYYY', year)
        .replace('MM', month)
        .replace('DD', day)
        .replace('HH', hours)
        .replace('mm', minutes)
        .replace('ss', seconds);
}

// Gestion de l'interface
document.addEventListener('DOMContentLoaded', function() {
    const dateInput = document.getElementById('dateInput');
    const formatSelect = document.getElementById('formatSelect');
    const customFormatGroup = document.getElementById('customFormatGroup');
    const customFormat = document.getElementById('customFormat');
    const formatBtn = document.getElementById('formatBtn');
    const result = document.getElementById('result');

    // Définir la date actuelle par défaut au format YYYY-MM-DDTHH:mm
    const now = new Date();
    const localDateTime = now.toISOString().slice(0, 16);
    dateInput.value = localDateTime;

    // Gérer l'affichage du format personnalisé
    formatSelect.addEventListener('change', function() {
        if (this.value === 'custom') {
            customFormatGroup.style.display = 'block';
        } else {
            customFormatGroup.style.display = 'none';
        }
        
        // Mettre à jour le résultat quand on change le format
        updateResult();
    });

    // Mettre à jour quand la date change
    dateInput.addEventListener('change', updateResult);
    customFormat.addEventListener('input', updateResult);

    // Fonction pour mettre à jour le résultat
    function updateResult() {
        let selectedFormat = formatSelect.value;
        
        if (selectedFormat === 'custom') {
            selectedFormat = customFormat.value || 'YYYY-MM-DD';
        }

        try {
            const formattedDate = formatDate(dateInput.value, selectedFormat);
            result.textContent = formattedDate;
            result.style.color = '#28a745';
        } catch (error) {
            result.textContent = 'Erreur: Format de date invalide';
            result.style.color = '#dc3545';
        }
    }

    // Formater la date au clic
    formatBtn.addEventListener('click', updateResult);

    // Exemple de formatage au chargement
    updateResult();

    // Ajouter des exemples de formats dynamiques
    const examples = document.querySelectorAll('.example');
    const currentDate = new Date();
    
    examples.forEach(example => {
        const code = example.querySelector('code');
        const span = example.querySelector('span');
        
        if (code && span) {
            const format = code.textContent;
            try {
                const formattedExample = formatDate(currentDate, format);
                span.textContent = `→ ${formattedExample}`;
            } catch (error) {
                span.textContent = '→ Format invalide';
                span.style.color = '#dc3545';
            }
        }
    });
});