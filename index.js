import { parseEnvFile } from "./env.js";

const dotenv = parseEnvFile('./.env');

async function search(query) {
    const apiUrl = `https://www.googleapis.com/customsearch/v1?key=${dotenv.API_KEY}&cx=${dotenv.CX_ID}&q=${query}`;
    const response = await fetch(apiUrl);
    const data = await response.json();
    displayResults(data);
};

function fetchSuggestions(query) {
    const url = `https://clients1.google.com/complete/search?hl=en&output=toolbar&q=${query}`;
    fetch(url)
        .then((response) => response.text())
        .then((xml) => parseSuggestions(xml))
        .catch((error) => console.error('Unable to fetch suggestions:', error));
};

function parseSuggestions(xml) {
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xml, 'text/xml');
    const suggestions = Array.from(xmlDoc.getElementsByTagName('suggestion'))
        .map((suggestion) => suggestion.getAttribute('data'))
        .slice(0, 10);
  
    const suggestionsDiv = document.querySelector('.suggestions');
    suggestionsDiv.innerHTML = '';
    suggestions.forEach((suggestion) => {
        const suggestionElement = document.createElement('div');
        suggestionElement.textContent = suggestion;
        suggestionsDiv.appendChild(suggestionElement);
    });
};

function displayIframe(url) {
    const iframe = document.createElement('iframe');

    iframe.src = url;
    iframe.width = "100%";
    iframe.height = "25%";
    iframe.title = "URL Preview";
};

function displayResults(data) {
    const searchResults = document.querySelector('.searchResults');
    searchResults.innerHTML = '';

    if (data.items && data.items.length > 0) {
        const list = document.createElement('ul');
        data.items.forEach((item) => {
            const listItem = document.createElement('li');
            const link = document.createElement('a');
            link.textContent = item.title;
            link.href = item.link;

            // Add a click event to open the URL in an iframe
            link.addEventListener('click', (event) => {
                event.preventDefault();
                displayIframe(item.link);
            });

            listItem.appendChild(link);
            list.appendChild(listItem);
        });

        searchResults.appendChild(list);
    } else {
        const paragraph = document.createElement('p');
        paragraph.textContent = 'Unable to find a match for search.';
        searchResults.appendChild(paragraph);
    }
};

document.querySelector('.urlInput').addEventListener('input', (e) => {
    const query = e.target.value;

    if (query.length > 0) {
        fetchSuggestions(query);
    } else {
        const suggestionsDiv = document.querySelector('.suggestions');
        suggestionsDiv.innerHTML = '';
    }
});

document.querySelector('.urlInput').addEventListener('keydown', (e) => {
    if (e.key === "Enter") {
        const url = e.target.value;

        const completeUrl = 
            url.startsWith("http://") || url.startsWith("https://")
                ? url
                : url.startsWith("www")
                ? `https://www.${url}`
                : `https://www.${url}`;

        document.querySelector('.urlInput').value = completeUrl;

        search(completeUrl);

        e.preventDefault();
    }
});