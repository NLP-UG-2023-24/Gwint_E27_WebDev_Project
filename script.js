document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selection ---
    const body = document.body;
    const html = document.documentElement;

    // Search elements (only on index.html, so check if they exist)
    const synonymsField = document.getElementById("synonyms");
    const antonymsField = document.getElementById("antonyms");
    const definitionField = document.getElementById("definition");
    const searchButton = document.getElementById("search_button");
    const randomButton = document.getElementById("random_button");
    const keywordInput = document.getElementById("keyword");
    
    // Control elements (on all pages)
    const modeButton = document.getElementById("mode_button");
    const accessibilityButton = document.getElementById("accessibility-button");
    const accessibilityOptions = document.getElementById("accessibility-options");
    const highContrastButton = document.getElementById("high-contrast-button");
    const grayscaleButton = document.getElementById("grayscale-button");
    const enlargeFontButton = document.getElementById("enlarge-font-button");
    const resetAccessibilityButton = document.getElementById("reset-accessibility-button");
    const accessibilityMenu = document.querySelector('.accessibility-menu');

    // --- API Configuration ---
    const APINinjasKey = "cXRL+1hx7MFwH/CcnJNt6w==ifTKw1ZncXBSDZ7Q";
    const apiBaseURL = "https://api.api-ninjas.com/v1/";

    // =========================================================================
    // ACCESSIBILITY LOGIC
    // =========================================================================
    
    const applyStoredAccessibility = () => {
        if (localStorage.getItem('accessibility_contrast') === 'high') {
            body.classList.add('high-contrast');
        }
        if (localStorage.getItem('accessibility_grayscale') === 'true') {
            body.classList.add('grayscale');
        }
        if (localStorage.getItem('accessibility_font') === 'enlarged') {
            html.classList.add('enlarge-font');
        }
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
        if (body.classList.contains('high-contrast')) {
            localStorage.setItem('accessibility_contrast', 'high');
        } else {
            localStorage.removeItem('accessibility_contrast');
        }
    });

    grayscaleButton.addEventListener('click', () => {
        body.classList.toggle('grayscale');
        body.classList.remove('high-contrast');
        localStorage.removeItem('accessibility_contrast');
        if (body.classList.contains('grayscale')) {
            localStorage.setItem('accessibility_grayscale', 'true');
        } else {
            localStorage.removeItem('accessibility_grayscale');
        }
    });

    enlargeFontButton.addEventListener('click', () => {
        html.classList.toggle('enlarge-font');
        if (html.classList.contains('enlarge-font')) {
            localStorage.setItem('accessibility_font', 'enlarged');
        } else {
            localStorage.removeItem('accessibility_font');
        }
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
        modeButton.textContent = "Light Mode";
    };

    const disableDarkmode = () => {
        body.classList.remove('dark_mode');
        localStorage.setItem('dark_mode', null);
        modeButton.textContent = "Dark Mode";
    };

    if (currentDarkmodeState === 'active') {
        enableDarkmode();
    } else {
        disableDarkmode();
    }
    applyStoredAccessibility();

    modeButton.addEventListener('click', () => {
        currentDarkmodeState = localStorage.getItem('dark_mode');
        if (currentDarkmodeState !== 'active') {
            enableDarkmode();
        } else {
            disableDarkmode();
        }
    });

    // =========================================================================
    // CORE SEARCH FUNCTIONALITY (check if elements exist)
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
            const dictionaryURL = `${apiBaseURL}dictionary?word=${keyword}`;
            const thesaurusURL = `${apiBaseURL}thesaurus?word=${keyword}`;

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
                    antonymsField.innerText = data.antonyms && data.antonyms.length > 0 ? data.antonyms.join(', ') : "No antonyms found.";
                })
                .catch(error => { console.error("Error fetching thesaurus:", error); synonymsField.innerText = "Could not fetch synonyms."; antonymsField.innerText = "Could not fetch antonyms."; });
        }

        function fetchRandomWord() {
            keywordInput.value = "Getting a random word...";
            fetch("https://random-word-api.herokuapp.com/word")
                .then(response => response.json())
                .then(data => {
                    const randomWord = data[0];
                    keywordInput.value = randomWord;
                    handleSearch(randomWord);
                })
                .catch(error => { console.error("Error fetching random word:", error); keywordInput.value = ""; definitionField.innerText = "Could not fetch a random word."; synonymsField.innerText = ""; antonymsField.innerText = ""; });
        }
        
        searchButton.addEventListener("click", () => handleSearch(keywordInput.value));
        randomButton.addEventListener("click", fetchRandomWord);
        keywordInput.addEventListener("keydown", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                handleSearch(keywordInput.value);
            }
        });
    }
});
