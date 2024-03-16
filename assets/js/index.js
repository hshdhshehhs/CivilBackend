
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('../worker.js', {
            scope: './document/'
        });
    });
}

const inp = document.querySelector('.urlInput');

if (inp) {
    inp.addEventListener('keydown', async (e) => {
        if (e.key === 'Enter') {
            console.log('Enter key pressed');
            e.preventDefault();
            processURL(inp.value, '/1');
        }
    });
}

function processURL(value, path) {
    let url = value.trim();
    const searchURL = 'https://www.google.com/search?q=';
    if (!isURL(url)) {
        url = searchURL + url;
    } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
        url = 'https://' + url;
    }

    sessionStorage.setItem('goURL', __uv$config.encodeUrl(url));
    const dy = localStorage.getItem('document');

    if (path) {
        location.href = path;
    } else if (dy === 'true') {
        window.location.href = './document/' + __uv$config.encodeUrl(url);
    } else {
        window.location.href = './period1/' + __uv$config.encodeUrl(url);
    }
}

function isURL(val = '') {
    if (/^http(s?):\/\//.test(val) || (val.includes('.') && val.substring(0, 1) !== ' ')) return true;
    return false;
}

function goToSite(value) {
    processURL(value, '/1');
}

function blankPage(value) {
    processURL(value);
}