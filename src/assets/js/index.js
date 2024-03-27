// deno-lint-ignore-file
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js', {
            scope: '/'
        });
    });
}

const inp = document.querySelector('div.header input');
const a = document.querySelectorAll('.suggestions li a');

inp.addEventListener('keydown', (e, path) => {
        if (e.key === 'Enter') {
            if (inp.value.match(/^http(s?):\/\//) || inp.value.includes('.') && inp.value.substring(0, 1) !== '') {
                return true;
            }

            let url = inp.value.trim();

            const search = 'https://www.google.com/search?q=';
    
            if (!url.match(/^http(s?):\/\//) || inp.value.includes('.') && inp.value.substring(0, 1) !== '') {
                url = search + url;
            } else if (!(url.startsWith('https://') || url.startsWith('http://'))) {
                url = 'https://' + url;
            }

            sessionStorage.setItem('goURL', __uv$config.encodeUrl(url));
            const doc = localStorage.getItem('document');

            if (path) {
                location.href = path;
            } else if (doc === 'true') {
                window.location.href = '/document/period1/' + __uv$config.encodeUrl(url);
            } else {
                window.location.href = '/document/' + __uv$config.encodeUrl(url);
            }
        }
});