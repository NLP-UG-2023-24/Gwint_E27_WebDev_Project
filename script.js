document.addEventListener('DOMContentLoaded', () => {

    // --- Element Selection ---
    const body = document.body;
    const modeButton = document.getElementById("mode_button");
    
    // --- Icon Definitions ---
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

    // --- API Configuration ---
    const APINinjasKey = "cXRL+1hx7MFwH/CcnJNt6w==ifTKw1ZncXBSDZ7Q";
    const apiBaseURL = "https://api.api-ninjas.com/v1/";

    // =========================================================================
    // PERSISTENT DARK MODE LOGIC (Runs on all pages)
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

    // On page load, apply the stored theme
    if (currentDarkmodeState === 'active') {
        enableDarkmode();
    } else {
        disableDarkmode();
    }

    // Add click listener for the mode button
    modeButton.addEventListener('click', () => {
        currentDarkmodeState = localStorage.getItem('dark_mode');
        if (currentDarkmodeState !== 'active') {
            enableDarkmode();
        } else {
            disableDarkmode();
        }
    });

    // =========================================================================
    // PAGE-SPECIFIC LOGIC FOR THE MAIN PAGE (index.html)
    // =========================================================================
    // Select elements that only exist on the main page
    const searchForm = document.getElementById('word-form');

    // If the form exists, then we are on the main page.
    if (searchForm) {
        const synonymsField = document.getElementById("synonyms");
        const antonymsField = document.getElementById("antonyms");
        const definitionField = document.getElementById("definition");
        const searchButton = document.getElementById("search_button");
        const randomButton = document.getElementById("random_button");
        const keywordInput = document.getElementById("keyword");

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
                    // This is where the corrected typo is:
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
        
        // Add event listeners for the main page buttons
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
