// Wait for the entire page to load before running any script
document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selection ---
    const synonymsField = document.getElementById("synonyms");
    const antonymsField = document.getElementById("antonyms");
    const definitionField = document.getElementById("definition");
    const searchButton = document.getElementById("search_button");
    const randomButton = document.getElementById("random_button"); // The new button
    const keywordInput = document.getElementById("keyword");
    const modeButton = document.getElementById("mode_button"); // Dark mode button
    const body = document.body;

    // --- API Configuration ---
    // NOTE: It is generally safer to handle API keys on a server-side proxy,
    // but for a client-side project, this is acceptable.
    const APINinjasKey = "cXRL+1hx7MFwH/CcnJNt6w==ifTKw1ZncXBSDZ7Q";
    const apiBaseURL = "https://api.api-ninjas.com/v1/";

    // =========================================================================
    // CORE SEARCH FUNCTIONALITY
    // =========================================================================

    /**
     * Main function to handle the search for a given word.
     * @param {string} keyword The word to search for.
     */
    function handleSearch(keyword) {
        // 1. Validate input
        if (!keyword || keyword.trim() === '') {
            definitionField.innerText = "Please enter a word to search.";
            synonymsField.innerText = "";
            antonymsField.innerText = "";
            return;
        }

        // 2. Set loading state for better UX
        definitionField.innerText = "Searching for definition...";
        synonymsField.innerText = "Searching for synonyms...";
        antonymsField.innerText = "Searching for antonyms...";

        // 3. Fetch all data for the keyword
        fetchData(keyword.trim());
    }

    /**
     * Fetches both definition and thesaurus data from the API-Ninjas.
     * @param {string} keyword The word to search for.
     */
    function fetchData(keyword) {
        const fetchOptions = {
            headers: { 'X-Api-Key': APINinjasKey }
        };

        const dictionaryURL = `${apiBaseURL}dictionary?word=${keyword}`;
        const thesaurusURL = `${apiBaseURL}thesaurus?word=${keyword}`;

        // Fetch Dictionary Data
        fetch(dictionaryURL, fetchOptions)
            .then(response => response.json())
            .then(data => {
                if (data.definition) {
                    definitionField.innerHTML = ""; // Clear loading text
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

        // Fetch Thesaurus Data
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

    /**
     * Fetches a random word and triggers a search for it.
     */
    function fetchRandomWord() {
        // Set a loading state in the input box itself
        keywordInput.value = "Getting a random word...";

        // This is a free random word API that doesn't require a key
        const randomWordApiUrl = "https://random-word-api.herokuapp.com/word";

        fetch(randomWordApiUrl)
            .then(response => response.json())
            .then(data => {
                const randomWord = data[0]; // The API returns an array with one word
                keywordInput.value = randomWord; // Put the word in the input box
                handleSearch(randomWord); // Automatically search for it
            })
            .catch(error => {
                console.error("Error fetching random word:", error);
                keywordInput.value = ""; // Clear the input box on error
                definitionField.innerText = "Could not fetch a random word. Please try again.";
                synonymsField.innerText = "";
                antonymsField.innerText = "";
            });
    }

    // =========================================================================
    // DARK MODE TOGGLE
    // =========================================================================
    
    /**
     * Toggles the 'dark_mode' class on the body element.
     */
    function toggleDarkMode() {
        body.classList.toggle('dark_mode');
    }

    // =========================================================================
    // EVENT LISTENERS (The part that makes the buttons work)
    // =========================================================================

    // Listener for the main search button
    searchButton.addEventListener("click", () => {
        handleSearch(keywordInput.value);
    });
    
    // Listener for the new random word button
    randomButton.addEventListener("click", fetchRandomWord);

    // Listener to allow "Enter" key to trigger a search
    keywordInput.addEventListener("keydown", (event) => {
        if (event.key === "Enter") {
            event.preventDefault(); // Prevent default form submission
            handleSearch(keywordInput.value);
        }
    });

    // Listener for the dark mode toggle button
    modeButton.addEventListener('click', toggleDarkMode);

});
