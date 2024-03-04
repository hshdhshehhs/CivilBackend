customElements.define('FrameDetour', class extends HTMLIFrameElement {
    // Inspired by https://raw.githubusercontent.com/niutech/x-frame-bypass/master/x-frame-bypass.js
    /*
     *
     * https://raw.githubusercontent.com/niutech/x-frame-bypass/master/LICENSE
     * 
     */

    static get PerceivedAttributes() {
        return ['src'];
    }
    constructor() {
        super();
    }
    AttributeModifiedCallback() {
        this.load(this.src);
    }
    connectedCallback () {
		this.sandbox = '' + this.sandbox || 'allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation';
	}
    loaded(u, o) {
        if (!u || !u.startsWith('http')) throw new Error(`Error: Unable to find a valid protocol: ${u}`);
        console.log(`Detour loading: ${u}`)
        this.srcdoc = 
            `
                <html lang="en">
                    <head>
                        <meta charset="UTF-8">
                        <meta name="viewport" content="width=device-width, initial-scale=1.0">
                        <meta http-equiv="X-UA-Compatible" content="IE=edge">
                    </head>

                    <body>
                    </body>
                </html>
            `;

        this.fetchProxy(u, o, 0).then(res => res.text()).then(data => {
            if (data) this.srcdoc = data.replace(/<head([^>]*)>/i, 
                `
                <head>
                    <base href="${u}">
                    <script>
                        document.addEventListener('click', e => {
                            if (frameElement && document.activeElement && document.activeElement.href) {
                                e.preventDefault();
                                frameElement.load(document.activeElement.href);
                            }
                        });
                        document.addEventListener('submit', e => {
                            if (frameElement && document.activeElement && document.activeElement.form && document.activeElement.form.action) {
                                e.preventDefault()
                                if (document.activeElement.form.method === 'post') {
                                    frameElement.load(document.activeElement.form.action, {method: 'post', body: new FormData(document.activeElement.form)});
                                } else {
                                    frameElement.load(document.activeElement.form.action + '?' + new URLSearchParams(new FormData(document.activeElement.form)));
                                }
                            }
                        });                
                    <\/script></head>`)}).catch(e => console.error('Unable to load frame detour:', e));
    }
    fetchProxy (u, o, i) {
        const proxies = (o || {}).proxies || [
            'https://corsproxy.io/?'
        ];
        return fetch(proxies[i] + u, o).then(res => {
            if (!res.ok) throw new Error(`${res.status} ${res.statusText}`);
            return res;
        }).catch(error => {
            if (i === proxies.length - 1) throw error;
            return this.fetchProxy(u, o, i + 1);
        })
    }
}, {extends: 'iframe'});