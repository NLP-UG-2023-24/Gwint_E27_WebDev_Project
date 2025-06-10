document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selection ---
    const synonymsField = document.getElementById("synonyms");
    const antonymsField = document.getElementById("antonyms");
    const definitionField = document.getElementById("definition");
    const searchButton = document.getElementById("search_button");
    const randomButton = document.getElementById("random_button");
    const keywordInput = document.getElementById("keyword");
    const modeButton = document.getElementById("mode_button");
    const body = document.body;

    // --- API Configuration ---
    const APINinjasKey = "cXRL+1hx7MFwH/CcnJNt6w==ifTKw1ZncXBSDZ7Q";
    const apiBaseURL = "https://api.api-ninjas.com/v1/";

    // =========================================================================
    // CORE SEARCH FUNCTIONALITY
    // =========================================================================
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
            .catch(error => {
                console.error("Error fetching definition:", error);
                definitionField.innerText = "Could not fetch definition. Please try again.";
            });

        fetch(thesaurusURL, fetchOptions)
            .then(response => response.json())
            .then(data => {
                const synonyms = data.synonyms && data.synonyms.length > 0
                    ? data.synonyms.join(', ')
                    : "No synonyms found.";
                const antonyms = data.antonyms && data.antonyms.length > 0
                    ? data.antonyms.join(', ')
                    : "No antonyms found.";
                synonymsField.innerText = synonyms;
                antonymsField.innerText = antonyms;
            })
            .catch(error => {
                console.error("Error fetching thesaurus:", error);
                synonymsField.innerText = "Could not fetch synonyms.";
                antonymsField.innerText = "Could not fetch antonyms.";
            });
    }

    // =========================================================================
    // RANDOM WORD FUNCTIONALITY
    // =========================================================================
    function fetchRandomWord() {
        keywordInput.value = "Getting a random word...";
        const randomWordApiUrl = "https://random-word-api.herokuapp.com/word";
        fetch(randomWordApiUrl)
            .then(response => response.json())
            .then(data => {
                const randomWord = data[0];
                keywordInput.value = randomWord;
                handleSearch(randomWord);
            })
            .catch(error => {
                console.error("Error fetching random word:", error);
                keywordInput.value = "";
                definitionField.innerText = "Could not fetch a random word. Please try again.";
                synonymsField.innerText = "";
                antonymsField.innerText = "";
            });
    }

    // =========================================================================
    // DARK MODE TOGGLE (UPDATED)
    // =========================================================================
    /**
     * Toggles the 'dark_mode' class on the body element and updates the
     * button text to reflect the current state.
     */
    function toggleDarkMode() {
        // First, toggle the class on the body element
        body.classList.toggle('dark_mode');

        // Now, check if the body currently has the 'dark_mode' class
        const isDarkMode = body.classList.contains('dark_mode');

        // Update the button's text based on the current mode
        if (isDarkMode) {
            // If the page IS in dark mode, the button should say "Light Mode"
            modeButton.textContent = 'Light Mode';
        } else {
            // If the page IS NOT in dark mode, the button should say "Dark Mode"
            modeButton.textContent = 'Dark Mode';
        }
    }
    
    // =========================================================================
    // EVENT LISTENERS
    // =========================================================================
    searchButton.addEventListener("click", () => {
        handleSearch(keywordInput.value);
    });
    
    randomButton.addEventListener("click", fetchRandomWord);

    keywordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            handleSearch(keywordInput.value);
        }
    });

    modeButton.addEventListener('click', toggleDarkMode);
});
