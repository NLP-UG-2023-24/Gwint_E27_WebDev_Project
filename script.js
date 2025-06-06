const synonymsField = document.getElementById("synonyms");
const antonymsField = document.getElementById("antonyms");
const searchButton = document.getElementById("search_button");
const keywordInput = document.getElementById("keyword");
const definition = document.getElementById("definition");


const APINinjasKey = "cXRL+1hx7MFwH/CcnJNt6w==ifTKw1ZncXBSDZ7Q";
const SynAntURL = "https://api.api-ninjas.com/v1/thesaurus?word=";

const word = 'happy';


function fetchSynonymsAntonyms(){

    const inputValue = keywordInput.value.replaceAll(" ","+");

    const SynAntUrlToSend = SynAntURL+inputValue;
    console.log(SynAntUrlToSend);

    fetch(SynAntUrlToSend, {
        headers: {
            'X-Api-Key': APINinjasKey
        }
    })
    .then(response => response.json())
    .then(response => {
        console.log(response);

        console.log(response.synonyms);
        synonyms_list = response.synonyms;
        synonyms.innerHTML = ""; // usuń elementy <li> z listy aliasów

        for (let i = 0; i < synonyms_list.length; i++){
            const newLi = document.createElement("li");
            newLi.innerText = synonyms_list[i];
            synonyms.appendChild(newLi);
        }

        console.log(response.antonyms);
        antonyms_list = response.antonyms;
        antonyms.innerHTML = ""; // usuń elementy <li> z listy aliasów

        for (let i = 0; i < antonyms_list.length; i++){
            const newLi = document.createElement("li");
            newLi.innerText = antonyms_list[i];
            antonyms.appendChild(newLi);
        }

    })
}

searchButton.addEventListener("click", () => {
    fetchSynonymsAntonyms();
    fetchDefinition();
});



function fetchDefinition() {
    const inputValue = keywordInput.value.trim().replaceAll(" ", "+");
    const DefinitionURL = "https://api.api-ninjas.com/v1/dictionary?word=" + inputValue;

    fetch(DefinitionURL, {
        headers: {
            'X-Api-Key': APINinjasKey
        }
    })
    .then(response => response.json())
    .then(response => {
        console.log("Definition response:", response);
        if (response.definition) {
            definition.innerText = response.definition;
        } else {
            definition.innerText = "No definition found.";
        }
    })
    .catch(error => {
        console.error("Błąd podczas pobierania definicji:", error);
        definition.innerText = "Error fetching definition.";
    });
}
