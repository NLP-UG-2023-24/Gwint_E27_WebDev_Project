document.addEventListener('DOMContentLoaded', () => {

    const body = document.body;
    const modeButton = document.getElementById("mode_button");
    
    const moonIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path></svg>`;
    const sunIcon = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

    const APINinjasKey = "BMTUUUx4u0h13RXF8jukgA==2Fm4l1vV3UDjf5ID";
    const apiBaseURL = "https://api.api-ninjas.com/v1/";

    let currentDarkmodeState = localStorage.getItem('dark_mode');

    const enableDarkmode = () => {
        body.classList.add('dark_mode');
        localStorage.setItem('dark_mode', 'active');
        if (modeButton) modeButton.innerHTML = sunIcon;
    };

    const disableDarkmode = () => {
        body.classList.remove('dark_mode');
        localStorage.setItem('dark_mode', null);
        if (modeButton) modeButton.innerHTML = moonIcon;
    };

    if (currentDarkmodeState === 'active') {
        enableDarkmode();
    } else {
        disableDarkmode();
    }

    if (modeButton) {
        modeButton.addEventListener('click', () => {
            currentDarkmodeState = localStorage.getItem('dark_mode');
            if (currentDarkmodeState !== 'active') {
                enableDarkmode();
            } else {
                disableDarkmode();
            }
        });
    }

    const searchForm = document.getElementById('word-form');

    if (searchForm) {
        const synonymsField = document.getElementById("synonyms");
        const antonymsField = document.getElementById("antonyms");
        const definitionField = document.getElementById("definition");
        const rhymesField = document.getElementById("rhymes");
        const searchButton = document.getElementById("search_button");
        const randomButton = document.getElementById("random_button");
        const keywordInput = document.getElementById("keyword");
        const wordDisplayContainer = document.getElementById("word-display-container");
        const fetchOptions = { headers: { 'X-Api-Key': APINinjasKey } };

        function handleSearch(keyword) {
            const trimmedKeyword = keyword.trim();
            if (!trimmedKeyword) {
                definitionField.innerText = "Please enter a word to search.";
                synonymsField.innerText = "";
                antonymsField.innerText = "";
                rhymesField.innerText = "";
                return;
            }

            wordDisplayContainer.innerHTML = `<h2>Results for: <em>${trimmedKeyword}</em></h2>`;
            wordDisplayContainer.style.display = 'block';

            definitionField.innerText = "Searching for definition...";
            synonymsField.innerText = "Searching for synonyms...";
            antonymsField.innerText = "Searching for antonyms...";
            rhymesField.innerText = "Searching for rhymes...";
            fetchData(trimmedKeyword);
        }

        async function fetchData(keyword) {
            const dictionaryURL = `${apiBaseURL}dictionary?word=${keyword}`;
            const thesaurusURL = `${apiBaseURL}thesaurus?word=${keyword}`;
            const rhymeURL = `${apiBaseURL}rhyme?word=${keyword}`;

            try {
                const responses = await Promise.all([
                    fetch(dictionaryURL, fetchOptions),
                    fetch(thesaurusURL, fetchOptions),
                    fetch(rhymeURL, fetchOptions)
                ]);

                for (const response of responses) {
                    if (!response.ok) {
                        throw new Error(`HTTP error! status: ${response.status}`);
                    }
                }

                const [dictData, thesaurusData, rhymeData] = await Promise.all(
                    responses.map(res => res.json())
                );

                if (dictData.definition) {
                    definitionField.innerHTML = "";
                    const parts = dictData.definition.split(/(?=\d+\.)/);
                    parts.forEach(part => {
                        if (part.trim()) {
                            const p = document.createElement("p");
                            p.innerText = part.trim();
                            definitionField.appendChild(p);
                        }
                    });
                } else {
                    definitionField.innerText = "No definition found.";
                }

                synonymsField.innerText = thesaurusData.synonyms && thesaurusData.synonyms.length > 0 ? thesaurusData.synonyms.join(', ') : "No synonyms found.";
                antonymsField.innerText = thesaurusData.antonyms && thesaurusData.antonyms.length > 0 ? thesaurusData.antonyms.join(', ') : "No antonyms found.";
                rhymesField.innerText = rhymeData.length > 0 ? rhymeData.join(', ') : "No rhymes found.";

            } catch (error) {
                console.error("Error fetching word data:", error);
                definitionField.innerText = "Could not fetch data. Please try again.";
                synonymsField.innerText = "N/A";
                antonymsField.innerText = "N/A";
                rhymesField.innerText = "N/A";
            }
        }

        function fetchRandomWord() {
            keywordInput.value = "Getting a random word...";
            const randomWordURL = `${apiBaseURL}randomword`;

            fetch(randomWordURL, fetchOptions)
                .then(response => {
                    if (!response.ok) {
                        throw new Error(`API error! status: ${response.status}`);
                    }
                    return response.json();
                })
                .then(data => {
                    const randomWord = data.word;
                    keywordInput.value = randomWord;
                    handleSearch(randomWord);
                })
                .catch(error => { 
                    console.error("Error fetching random word:", error); 
                    keywordInput.value = ""; 
                    definitionField.innerText = "Could not fetch a random word."; 
                    synonymsField.innerText = ""; 
                    antonymsField.innerText = ""; 
                    rhymesField.innerText = "";
                });
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
