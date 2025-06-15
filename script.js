// ===================================
// DARK MODE TOGGLE
// ===================================
const toggle = document.getElementById('darkModeToggle');

// On page load, check if dark mode was saved in localStorage
if (localStorage.getItem('dark-mode') === 'true') {
    document.body.classList.add('dark-mode');
    if (toggle) toggle.checked = true;
}

// When the toggle is clicked, switch the theme and save the preference
if (toggle) {
    toggle.addEventListener('change', () => {
        document.body.classList.toggle('dark-mode', toggle.checked);
        localStorage.setItem('dark-mode', toggle.checked);
    });
}


// ===================================
// MAIN PAGE SEARCH FUNCTIONALITY
// ===================================
const searchButton = document.getElementById('search-button');

// Only run this code if we are on the main page (where the search button exists)
if (searchButton) {
    const clearButton = document.getElementById('clear-button');
    const wordInput = document.getElementById('word-input');
    const resultParagraphs = document.querySelectorAll('.dictionary p');
    // IMPORTANT: In a real-world app with private data, never expose your API key like this.
    // For a public, client-side API like Wordnik, it is acceptable.
    const apiKey = 'gqsv9riz53v4hn1jhyv41at2xcmyj8n18z5ia6j7d9z87p2sh';

    function performSearch() {
        const word = wordInput.value.trim();
        if (word === '') {
            alert('Please enter a word!');
            return;
        }

        // Set a "Loading..." message for the user right away
        resultParagraphs.forEach(p => p.textContent = 'Loading...');

        // --- Fetch Definition ---
        fetch(`https://api.wordnik.com/v4/word.json/${word}/definitions?limit=1&api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                resultParagraphs[0].textContent = (data.length > 0) ? data[0].text : 'No definition found.';
            })
            .catch(error => {
                console.error('Definition Error:', error);
                resultParagraphs[0].textContent = 'Error fetching definition.';
            });

        // --- Fetch Etymology ---
        fetch(`https://api.wordnik.com/v4/word.json/${word}/etymologies?api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    resultParagraphs[1].textContent = data[0].replace(/<[^>]*>/g, ''); // Removes XML tags
                } else {
                    resultParagraphs[1].textContent = 'No etymology found.';
                }
            })
            .catch(error => {
                console.error('Etymology Error:', error);
                resultParagraphs[1].textContent = 'Error fetching etymology.';
            });

        // --- Fetch Synonyms ---
        fetch(`https://api.wordnik.com/v4/word.json/${word}/relatedWords?relationshipTypes=synonym&api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0 && data[0].words.length > 0) {
                    resultParagraphs[2].textContent = data[0].words.join(', ');
                } else {
                    resultParagraphs[2].textContent = 'No synonyms found.';
                }
            })
            .catch(error => {
                console.error('Synonym Error:', error);
                resultParagraphs[2].textContent = 'Error fetching synonyms.';
            });

        // --- Fetch Examples ---
        fetch(`https://api.wordnik.com/v4/word.json/${word}/examples?limit=3&api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.examples && data.examples.length > 0) {
                    resultParagraphs[3].textContent = data.examples.map(e => `• ${e.text}`).join('\n\n');
                } else {
                    resultParagraphs[3].textContent = 'No examples found.';
                }
            })
            .catch(error => {
                console.error('Example Error:', error);
                resultParagraphs[3].textContent = 'Error fetching examples.';
            });
        
        // --- Fetch Pronunciation ---
        fetch(`https://api.wordnik.com/v4/word.json/${word}/pronunciations?useCanonical=false&typeFormat=ipa&limit=1&api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.length > 0) {
                    resultParagraphs[4].textContent = data[0].raw;
                } else {
                    resultParagraphs[4].textContent = 'No pronunciation found.';
                }
            })
            .catch(error => {
                console.error('Pronunciation Error:', error);
                resultParagraphs[4].textContent = 'Error fetching pronunciation.';
            });

        // --- Fetch Word Frequency ---
        fetch(`https://api.wordnik.com/v4/word.json/${word}/frequency?api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                if (data.totalCount) {
                    resultParagraphs[5].textContent = `Total occurrences since 1800: ${data.totalCount.toLocaleString()}`;
                } else {
                    resultParagraphs[5].textContent = 'No frequency data found.';
                }
            })
            .catch(error => {
                console.error('Frequency Error:', error);
                resultParagraphs[5].textContent = 'Error fetching frequency.';
            });
    }

    // --- Add Event Listeners for the main page ---
    searchButton.addEventListener('click', performSearch);
    
    wordInput.addEventListener('keydown', event => {
        if (event.key === 'Enter') {
            performSearch();
        }
    });

    clearButton.addEventListener('click', () => {
        wordInput.value = '';
        resultParagraphs.forEach(p => p.textContent = '');
    });
}


// ===================================
// "ABOUT WEBSITE" PAGE FEATURES
// ===================================
const wordOfTheDayContainer = document.getElementById('word-of-the-day-container');

// Only run this code on the "About" page
if (wordOfTheDayContainer) {
    const apiKey = 'gqsv9riz53v4hn1jhyv41at2xcmyj8n18z5ia6j7d9z87p2sh';

    // --- Fetch the Word of the Day ---
    function getWordOfTheDay() {
        fetch(`https://api.wordnik.com/v4/words.json/wordOfTheDay?api_key=${apiKey}`)
            .then(response => response.json())
            .then(data => {
                document.getElementById('wod-word').textContent = data.word;
                if (data.definitions && data.definitions.length > 0) {
                    document.getElementById('wod-definition').textContent = data.definitions[0].text;
                }
                if (data.pronunciations && data.pronunciations.length > 0) {
                    document.getElementById('wod-pronunciation').textContent = `(${data.pronunciations[0].raw})`;
                }
            })
            .catch(error => {
                console.error("Word of the Day Error:", error);
                document.getElementById('wod-word').textContent = "Could not load word.";
            });
    }

    // --- Logic for the Random Word Generator ---
    const randomWordBtn = document.getElementById('random-word-btn');
    const randomWordResult = document.getElementById('random-word-result');

    randomWordBtn.addEventListener('click', () => {
        randomWordResult.textContent = 'Generating...';
        fetch(`https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&minCorpusCount=5000&api_key=${apiKey}`)
            .then(response => {
                // This check is crucial to prevent the button from getting "stuck" on an error
                if (!response.ok) {
                    throw new Error(`HTTP error! Status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                const link = document.createElement('a');
                link.href = `index.html#${data.word}`;
                link.textContent = `Click here to look up "${data.word}"!`;
                
                randomWordResult.innerHTML = '';
                randomWordResult.appendChild(link);
            })
            .catch(error => {
                console.error("Random Word Error:", error);
                randomWordResult.textContent = 'Could not get a random word. Please try again.';
            });
    });

    // Run this function when the page loads
    getWordOfTheDay();
}


// ===================================
// BONUS: AUTO-SEARCH FROM URL LINK
// ===================================
// This runs when any page is fully loaded
document.addEventListener('DOMContentLoaded', () => {
    // Check if we are on the homepage AND there is a word in the URL (e.g., from the random word link)
    if (document.getElementById('search-button') && window.location.hash) {
        // Get word from the URL, removing the '#' symbol
        const wordFromLink = window.location.hash.substring(1);
        const wordInput = document.getElementById('word-input');
        const searchButton = document.getElementById('search-button');
        
        if (wordInput && searchButton) {
            wordInput.value = wordFromLink; // Put the word in the search box
            searchButton.click();           // Automatically click "Search"
            window.location.hash = '';      // Clean up the URL
        }
    }
});
