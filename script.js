const synonymsField = document.getElementById("synonyms");
const antonymsField = document.getElementById("antonyms");
const searchButton = document.getElementById("search_button");
const keywordInput = document.getElementById("keyword");

const APINinjasKey = "cXRL+1hx7MFwH/CcnJNt6w==ifTKw1ZncXBSDZ7Q";
const SynAntURL = "https://api.api-ninjas.com/v1/thesaurus?word=";

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

        // synonyms

        synonyms_list = response.synonyms;
        synonyms_text = "";
        for (let i = 0; i < synonyms_list.length-1; i++){
            synonyms_text += synonyms_list[i] + ", ";
        }
        synonyms_text += synonyms_list[synonyms_list.length -1];
        synonyms.innerText = synonyms_text;

        // antonyms

        antonyms_list = response.antonyms;
        antonyms_text = "";
        for (let i = 0; i < antonyms_list.length-1; i++){
            antonyms_text += antonyms_list[i] + ", ";
        }
        antonyms_text += antonyms_list[antonyms_list.length -1];
        antonyms.innerText = antonyms_text;

    })
}

keywordInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        searchButton.click();
    }
});

searchButton.addEventListener("click", fetchSynonymsAntonyms);
