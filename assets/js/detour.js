customElements.define('detour', class extends HTMLIFrameElement {
    static get observedAttributes() {
        return ['src'];
    }

    constructor() {
        super();
        this.sandbox = 'allow-forms allow-modals allow-pointer-lock allow-popups allow-popups-to-escape-sandbox allow-presentation allow-same-origin allow-scripts allow-top-navigation-by-user-activation';

        this.addEventListener('click', this.handleClick);
        this.addEventListener('submit', this.handleSubmit);
    }

    attributeChangedCallback(name, oldValue, newValue) {
        if (name === 'src' && newValue !== null) this.load(newValue);
    }

    connectedCallback() {
        if (!this.hasAttribute('src')) throw new Error("Unable to fulfill need by client: 'src' attribute not specified");
    }

    load(url) {
        if (!url || !url.startsWith('http')) throw new Error(`Unable to validate URL: client did not provide "http(s)://"`);
        console.log('Loading:', url);

        this.fetchProxy(url)
            .then(response => response.text())
            .then(data => {
                if (data) this.srcdoc = data;
            })
            .catch(error => {
                console.error('Unable to load: ', error);
            });
    }

    async fetchProxy(url) {
        const proxyUrl = 'https://corsproxy.io/?' + encodeURIComponent(url);

        try {
            const response = await fetch(proxyUrl);
            if (!response.ok) throw new Error(`${response.status} ${response.statusText}`);
            return response;
        } catch {
            throw new Error('Unable to connect to the proxy');
        }
    }

    handleClick = (event) => {
        if (event.target === this && frameElement && document.activeElement && document.activeElement.href) {
            event.preventDefault();
            this.load(document.activeElement.href);
        }
    }

    handleSubmit = (event) => {
        if (frameElement && document.activeElement && document.activeElement.form && document.activeElement.form.action) {
            event.preventDefault();

            const formData = new FormData(document.activeElement.form);
            const method = document.activeElement.form.method;

            if (method === 'post') {
                this.load(document.activeElement.form.action, {
                    method: 'post',
                    body: formData
                });
            } else {
                const queryString = new URLSearchParams(formData).toString();
                this.load(document.activeElement.form.action + '?' + queryString);
            }
        }
    }
}, {
    extends: 'iframe'
});