let allNames = [];
let digitsUsed = [];
let initialNameLength = null;

const letterValues = {
    'a': 1, 'b': 2, 'c': 3, 'd': 4, 'e': 5, 'f': 6, 'g': 7, 'h': 8, 'i': 9, 'j': 10,
    'k': 11, 'l': 12, 'm': 13, 'n': 14, 'o': 15, 'p': 16, 'q': 17, 'r': 18, 's': 19, 
    't': 20, 'u': 21, 'v': 22, 'w': 23, 'x': 24, 'y': 25, 'z': 26,
};

async function loadNames() {
    const response = await fetch('meskie.csv'); 
    const data = await response.text();
    allNames = data.split('\n').map(line => line.trim()).filter(line => line);
}

function addDigitsAndSearch() {
    const digitsInput = document.getElementById('digits').value;
    const nameLength = document.getElementById('nameLength').value;

    if (initialNameLength === null && nameLength) {
        initialNameLength = parseInt(nameLength);
        document.getElementById('nameLength').style.display = 'none';
        document.getElementById('nameLengthLabel').style.display = 'none';
    }

    if (digitsInput) {
        const newDigits = digitsInput.split(',').map(digit => digit.trim()).filter(digit => !digitsUsed.includes(digit));
        if (newDigits.length > 0) {
            digitsUsed.push(...newDigits);
            searchNames();
            document.getElementById('digitsUsed').textContent = `Użyte cyfry: ${digitsUsed.join(', ')}`;
        }
    }
    document.getElementById('digits').value = ''; // Clear input after adding
}

function searchNames() {
    let filteredNames = allNames.filter(name => {
        if (name.length !== initialNameLength) {
            return false;
        }

        const nameLowerCase = name.toLowerCase();
        const digitCounts = {};

        // Zlicz wystąpienia liter w imieniu
        for (let char of nameLowerCase) {
            if (!letterValues[char]) continue;
            const digit = letterValues[char];
            digitCounts[digit] = (digitCounts[digit] || 0) + 1;
        }

        // Sprawdź, czy każde wystąpienie cyfry pasuje do zliczonych liter
        const requiredCounts = digitsUsed.reduce((acc, digit) => {
            acc[digit] = (acc[digit] || 0) + 1;
            return acc;
        }, {});

        return Object.keys(requiredCounts).every(digit => {
            return digitCounts[digit] >= requiredCounts[digit];
        });
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
    digitsUsed = [];
    initialNameLength = null;
    document.getElementById('nameLength').style.display = 'inline';
    document.getElementById('nameLengthLabel').style.display = 'inline';
    document.getElementById('digitsUsed').textContent = '';
    displayResults(allNames);
}

window.onload = loadNames;
