document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selection ---
    const body = document.body;
    const html = document.documentElement;

    const synonymsField = document.getElementById("synonyms");
    const antonymsField = document.getElementById("antonyms");
    const definitionField = document.getElementById("definition");
    const searchButton = document.getElementById("search_button");
    const randomButton = document.getElementById("random_button");
    const keywordInput = document.getElementById("keyword");
    
    const modeButton = document.getElementById("mode_button");
    const accessibilityButton = document.getElementById("accessibility-button");
    const accessibilityOptions = document.getElementById("accessibility-options");
    const highContrastButton = document.getElementById("high-contrast-button");
    const grayscaleButton = document.getElementById("grayscale-button");
    const enlargeFontButton = document.getElementById("enlarge-font-button");
    const resetAccessibilityButton = document.getElementById("reset-accessibility-button");
    const accessibilityMenu = document.querySelector('.accessibility-menu');

    // --- Icon Definitions ---
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

    // --- API Configuration ---
    const APINinjasKey = "cXRL+1hx7MFwH/CcnJNt6w==ifTKw1ZncXBSDZ7Q";
    const apiBaseURL = "https://api.api-ninjas.com/v1/";

    // =========================================================================
    // ACCESSIBILITY LOGIC
    // =========================================================================
    const applyStoredAccessibility = () => {
        if (localStorage.getItem('accessibility_contrast') === 'high') body.classList.add('high-contrast');
        if (localStorage.getItem('accessibility_grayscale') === 'true') body.classList.add('grayscale');
        if (localStorage.getItem('accessibility_font') === 'enlarged') html.classList.add('enlarge-font');
    };

    accessibilityButton.addEventListener('click', (event) => {
        event.stopPropagation();
        const isExpanded = accessibilityButton.getAttribute('aria-expanded') === 'true';
        accessibilityButton.setAttribute('aria-expanded', !isExpanded);
        accessibilityOptions.classList.toggle('show');
    });

    window.addEventListener('click', () => {
        if (accessibilityOptions.classList.contains('show')) {
            accessibilityOptions.classList.remove('show');
            accessibilityButton.setAttribute('aria-expanded', 'false');
        }
    });

    accessibilityOptions.addEventListener('click', (event) => event.stopPropagation());

    highContrastButton.addEventListener('click', () => {
        body.classList.toggle('high-contrast');
        body.classList.remove('grayscale');
        localStorage.removeItem('accessibility_grayscale');
        if (body.classList.contains('high-contrast')) localStorage.setItem('accessibility_contrast', 'high');
        else localStorage.removeItem('accessibility_contrast');
    });

    grayscaleButton.addEventListener('click', () => {
        body.classList.toggle('grayscale');
        body.classList.remove('high-contrast');
        localStorage.removeItem('accessibility_contrast');
        if (body.classList.contains('grayscale')) localStorage.setItem('accessibility_grayscale', 'true');
        else localStorage.removeItem('accessibility_grayscale');
    });

    enlargeFontButton.addEventListener('click', () => {
        html.classList.toggle('enlarge-font');
        if (html.classList.contains('enlarge-font')) localStorage.setItem('accessibility_font', 'enlarged');
        else localStorage.removeItem('accessibility_font');
    });

    resetAccessibilityButton.addEventListener('click', () => {
        body.classList.remove('high-contrast', 'grayscale');
        html.classList.remove('enlarge-font');
        localStorage.removeItem('accessibility_contrast');
        localStorage.removeItem('accessibility_grayscale');
        localStorage.removeItem('accessibility_font');
    });

    // =========================================================================
    // PERSISTENT DARK MODE LOGIC
    // =========================================================================
    let currentDarkmodeState = localStorage.getItem('dark_mode');

    const enableDarkmode = () => {
        body.classList.add('dark_mode');
        localStorage.setItem('dark_mode', 'active');
        modeButton.innerHTML = sunIcon;
    };

    const disableDarkmode = () => {
        body.classList.remove('dark_mode');
        localStorage.setItem('dark_mode', null);
        modeButton.innerHTML = moonIcon;
    };

    if (currentDarkmodeState === 'active') enableDarkmode();
    else disableDarkmode();
    
    applyStoredAccessibility();

    modeButton.addEventListener('click', () => {
        currentDarkmodeState = localStorage.getItem('dark_mode');
        if (currentDarkmodeState !== 'active') enableDarkmode();
        else disableDarkmode();
    });

    // =========================================================================
    // CORE SEARCH FUNCTIONALITY (check if elements exist to avoid errors)
    // =========================================================================
    if (searchButton) { 
        function handleSearch(keyword) {
            if (!keyword || keyword.trim() === '') {
                definitionField.innerText = "Please enter a word to search.";
                synonymsField.innerText = "";
                antonymsField.innerText = "";
                return;
            }
            definitionField.innerText = "Searching for definition...";
            synonymsField.innerText = "Searching for synonyms...";
            antonymsField.innerText = "Searching for antonyms...";
            fetchData(keyword.trim());
        }

        function fetchData(keyword) {
            const fetchOptions = { headers: { 'X-Api-Key': APINinjasKey } };
            const dictionaryURL = `<span class="math-inline">\{apiBaseURL\}dictionary?word\=</span>{keyword}`;
            const thesaurusURL = `<span class="math-inline">\{apiBaseURL\}thesaurus?word\=</span>{keyword}`;

            fetch(dictionaryURL, fetchOptions)
                .then(response => response.json())
                .then(data => {
                    if (data.definition) {
                        definitionField.innerHTML = "";
                        const parts = data.definition.split(/(?=\d+\.)/);
                        parts.forEach(part => {
                            const p = document.createElement("p");
                            p.innerText = part.trim();
                            definitionField.appendChild(p);
                        });
                    } else {
                        definitionField.innerText = "No definition found.";
                    }
                })
                .catch(error => { console.error("Error fetching definition:", error); definitionField.innerText = "Could not fetch definition."; });

            fetch(thesaurusURL, fetchOptions)
                .then(response => response.json())
                .then(data => {
                    synonymsField.innerText = data.synonyms && data.synonyms.length > 0 ? data.synonyms.join(', ') : "No synonyms found.";
                    antonymsField.innerText = data.antonyms && data.antonyms.length > a
