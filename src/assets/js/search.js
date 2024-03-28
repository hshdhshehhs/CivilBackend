const urlInput = document.querySelector(".urlInput"),
    suggestionsMenu = document.querySelector(".suggestions");

urlInput.addEventListener("input", () => {
    suggestionsMenu.style.display = 'flex';
    const e = urlInput.value.trim();
    if (e.startsWith("http://") || e.startsWith("https://")) {
        suggestionsMenu.textContent = e;
        return;
    }
    if (e == "") suggestionsMenu.style.display = 'none';
    let debounceTimeout;
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => {
        getSearchSuggestions(e)
            .then((e) => {
                suggestionsMenu.innerHTML = "";
                if (e.length) {
                    suggestionsMenu.innerHTML = e
                        .map((el) => `<li><a>${el}</a></li>`)
                        .join("");
                    suggestionsMenu.querySelectorAll('li a')
                        .forEach(a => {
                            a.addEventListener(
                                "click",
                                (event) => {
                                    if ("A" === event.target.tagName) {
                                        const q = event.target.textContent.trim();

                                        const x = window.open();
                                        x.document.head.innerHTML = 
                                            `
                                                <meta charset="UTF-8">
                                                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                                                <meta http-equiv="X-UA-Compatible" content="IE=edge">
                                                <meta name="referrer" content="no-referrer">
                                                <title>Google Docs</title>
                                                <link rel="icon" type="image/x-icon" href="https://ssl.gstatic.com/docs/doclist/images/mediatype/icon_1_document_x16.png">
                                                <link rel="stylesheet" type="text/css" href="/src/assets/styles/blank.css">
                                                <link rel="preconnect" href="https://fonts.googleapis.com">
                                                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                                                <link href="https://fonts.googleapis.com/css2?family=Alata&display=swap" rel="stylesheet">
                                                <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css" integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA==" crossorigin="anonymous" referrerpolicy="no-referrer" />
                                                <script type="text/javascript" src="https://unpkg.com/@ungap/custom-elements-builtin"></script>
                                                <script type="text/javascript" src="https://niutech.github.io/x-frame-bypass/x-frame-bypass.js"></script>
                                            `;

                                        x.document.body.innerHTML = 
                                            `
                                                <iframe is="x-frame-bypass" src="https://www.google.com/search?q=${encodeURIComponent(q)}&igu=1" class="frame"></iframe>
                                                <div class="r">
                                                    <i class="fa-solid fa-rotate-right"></i>
                                                </div>
                                                <div class="f">
                                                    <i class="fa-solid fa-expand"></i>
                                                </div>
                                                <div class="h">
                                                    <i class="fa-solid fa-house"></i>
                                                </div>
                                            `;
                                        
                                        x.document.querySelector('iframe').contentWindow.addEventListener('beforeunload', (e) => {
                                            if (x.document.querySelector('iframe').contentWindow.location.href.includes('securly.com')) {
                                                e.preventDefault();
                                                e.returnValue = '';
                                            }
                                            e.returnValue = 'Leave site [ok/cancel]';
                                        });

                                        x.document.querySelector('iframe').contentWindow.addEventListener('click', (e) => {
                                            if (e.target.tagName === 'A' && e.target.href.includes('securly.com')) {
                                                e.preventDefault();
                                                x.document.querySelector('iframe').contentWindow.history.go(-1);
                                            }
                                        });

                                        x.document.querySelector('iframe').contentWindow.addEventListener('popstate', () => {
                                            if (x.document.querySelector('iframe').contentWindow.location.href.includes('securly.com')) {
                                                x.document.querySelector('iframe').contentWindow.history.forward();
                                            }
                                        });

                                        function beforeUnload() {
                                            1;
                                        }

                                        x.document.querySelector('iframe').contentWindow.addEventListener('beforeunload', beforeUnload());

                                        function shouldPreventUrlChange() {
                                            if (x.document.querySelector('iframe').contentWindow.location.href.includes('securly.com') || x.document.querySelector('iframe').contentWindow.location.href.includes('jcdhmojfecjfmbdpchihbeilohgnbdci')) {
                                                1;
                                            }
                                        }

                                        x.document.querySelector('iframe').contentWindow.document.querySelectorAll('a')
                                            .forEach((a) => {
                                                a.addEventListener('click', () => {
                                                    x.document.querySelector('iframe').contentWindow.addEventListener('beforeunload', () => {
                                                        1;
                                                    });
                                                });
                                            });
                                    }
                                }, {
                                    once: true
                                }
                            );
                        });
                }
            })
            .catch((error) => console.error(error));
    }, 300);
});

const getSearchSuggestions = (e) =>
    fetch(`https://corsproxy.io/?https://clients1.google.com/complete/search?hl=en&output=toolbar&q=${encodeURIComponent(
                e
            )}`, {
        mode: "cors",
        method: "GET",
    })
    .then((res) => {
        if (!res.ok) throw Error(`Unable to find a match for response status: ${res.status}`);
        return res.text();
    })
    .then((data) => {
        let parser = new DOMParser(),
            xmlDoc = parser.parseFromString(data, "text/xml"),
            suggestions = [];

        for (let i = 0; i < xmlDoc.getElementsByTagName("suggestion").length; i++) suggestions.push(xmlDoc.getElementsByTagName("suggestion")[i].getAttribute("data"));

        return suggestions.slice(0, 10);
    })
    .catch((error) => (console.error(error), []));