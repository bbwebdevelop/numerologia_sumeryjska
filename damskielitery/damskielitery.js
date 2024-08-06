let allNames = [];
let lettersUsed = [];
let initialNameLength = null;

async function loadNames() {
    const response = await fetch('zenskie.csv');
    const data = await response.text();
    allNames = data.split('\n').map(line => line.trim()).filter(line => line);
}

function addLettersAndSearch() {
    const lettersInput = document.getElementById('letters').value.toLowerCase();
    const nameLength = document.getElementById('nameLength').value;

    if (initialNameLength === null && nameLength) {
        initialNameLength = parseInt(nameLength);
        document.getElementById('nameLength').style.display = 'none';
        document.getElementById('nameLengthLabel').style.display = 'none';
    }

    if (lettersInput) {
        const newLetters = lettersInput.split(',').map(letter => letter.trim()).filter(letter => !lettersUsed.includes(letter));
        if (newLetters.length > 0) {
            lettersUsed.push(...newLetters);
            searchNames();
            document.getElementById('lettersUsed').textContent = `Użyte litery: ${lettersUsed.join(', ')}`;
        }
    }
    document.getElementById('letters').value = ''; // Clear input after adding
}

function searchNames() {
    let filteredNames = allNames.filter(name => {
        return name.length === initialNameLength && lettersUsed.every(lt => name.toLowerCase().includes(lt));
    });

    displayResults(filteredNames);
}

function displayResults(names) {
    const resultsContainer = document.getElementById('results');
    if (names.length > 0) {
        resultsContainer.innerHTML = `<h2>Znalezione Imiona:</h2><ul>${names.map(name => `<li>${name}</li>`).join('')}</ul>`;
    } else {
        resultsContainer.innerHTML = "<p>Brak wyników.</p>";
    }
}

function resetSearch() {
    lettersUsed = [];
    initialNameLength = null;
    document.getElementById('nameLength').style.display = 'inline';
    document.getElementById('nameLengthLabel').style.display = 'inline';
    document.getElementById('lettersUsed').textContent = '';
    displayResults(allNames);
}

window.onload = loadNames;
