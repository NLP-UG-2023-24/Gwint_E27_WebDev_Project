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
            .catch(error => { console.error("Error fetching definition:", error); definitionField.innerText = "Could not fetch definition."; });

        fetch(thesaurusURL, fetchOptions)
            .then(response => response.json())
            .then(data => {
                synonymsField.innerText = data.synonyms && data.synonyms.length > 0 ? data.synonyms.join(', ') : "No synonyms found.";
                antonymsField.innerText = data.antonyms && data.antonyms.length > 0 ? data.antonyms.join(', ') : "No antonyms found.";
            })
            .catch(error => { console.error("Error fetching thesaurus:", error); synonymsField.innerText = "Could not fetch synonyms."; antonymsField.innerText = "Could not fetch antonyms."; });
    }

    // =========================================================================
    // RANDOM WORD FUNCTIONALITY
    // =========================================================================
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

    // =========================================================================
    // PERSISTENT DARK MODE (Uses localStorage)
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

    // On page load, check the user's saved preference and apply it.
    if (currentDarkmodeState === 'active') {
        enableDarkmode();
    } else {
        disableDarkmode();
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

    // Add the click listener for the dark mode button.
    modeButton.addEventListener('click', () => {
        // Check the state again in case another tab changed it.
        currentDarkmodeState = localStorage.getItem('dark_mode');
        if (currentDarkmodeState !== 'active') {
            enableDarkmode();
        } else {
            disableDarkmode();
        }
    });
});
