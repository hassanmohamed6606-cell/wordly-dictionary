const form = document.getElementById("searchForm");
const wordInput = document.getElementById("wordInput");
const result = document.getElementById("result");
const savedWords = document.getElementById("savedWords");
const themeBtn = document.getElementById("themeBtn");
const counter = document.getElementById("count");

form.addEventListener("submit", searchWord);

themeBtn.addEventListener("click", changeTheme);

function searchWord(event) {

    event.preventDefault();

    const word = wordInput.value.trim();

    if (word === "") {
    result.textContent = "Please enter a word.";
    return;
}

    result.textContent = "Loading...";

    fetch(`https://api.dictionaryapi.dev/api/v2/entries/en/${word}`)

        .then(response => {

            if (!response.ok) {
                throw Error("Word not found");
            }

            return response.json();

        })

        .then(data => {

            displayWord(data[0]);

            wordInput.value = "";

        })

        .catch(error => {

            result.innerHTML = `
                <h2>Error</h2>
                <p>${error.message}</p>
            `;

        });

}

function displayWord(wordData) {

    const word = wordData.word;

    const phonetic = wordData.phonetic || "N/A";

    const audio = wordData.phonetics.find(p => p.audio && p.audio.trim() !== "")?.audio || "";

    console.log(audio);

    const partOfSpeech = wordData.meanings[0].partOfSpeech;

    const definition = wordData.meanings[0].definitions[0].definition;

    const example =
        wordData.meanings[0].definitions[0].example || "No example available.";

    const synonyms =
        wordData.meanings[0].synonyms.join(", ") || "None";

    const source = wordData.sourceUrls[0];

    result.innerHTML = `

        <h2>${word}</h2>

        <p><strong>Pronunciation:</strong> ${phonetic}</p>

        ${
           audio
                ? `
                <button id="playAudio">
                     🔊 Play Pronunciation
                </button>
                `
                : ""
         }

        <p><strong>Part of Speech:</strong> ${partOfSpeech}</p>

        <p><strong>Definition:</strong> ${definition}</p>

        <p><strong>Example:</strong> ${example}</p>

        <p><strong>Synonyms:</strong> ${synonyms}</p>

        <p>
            <a href="${source}" target="_blank" rel="noopener noreferrer">
                Source
            </a>
        </p>

        <button id="saveBtn">
            Save Word
        </button>

    `;

    const saveBtn = document.getElementById("saveBtn");

    saveBtn.addEventListener("click", function () {

        saveWord(word);

    });

    const playBtn = document.getElementById("playAudio");

    if (playBtn && audio) {
       playBtn.addEventListener("click", () => {
          const pronunciation = new Audio(audio);

          pronunciation.play()
            .then(() => console.log("Playing..."))
            .catch(err => console.error(err));
       });
}

}
function updateCount() {

    counter.textContent = `Saved Words: ${savedWords.children.length}`;
}

function saveWord(word) {

    if ( Array.from( savedWords.children).some(li => li.firstChild.textContent === word)) {
        alert("Word already saved!");
        return;
    }

    const li = document.createElement("li");

    li.textContent = word;

    li.classList.add("saved");

    const removeBtn = document.createElement("button");

    removeBtn.textContent = "Remove";

    removeBtn.addEventListener("click", function () {

        li.remove();
        
        updateCount();

    });

    li.appendChild(removeBtn);

    savedWords.appendChild(li);

    updateCount();

}

function changeTheme() {

    document.body.classList.toggle("dark");

    if (document.body.classList.contains("dark")) {

        themeBtn.textContent = "Light Mode";

    } else {

        themeBtn.textContent = "Dark Mode";

    }

}
