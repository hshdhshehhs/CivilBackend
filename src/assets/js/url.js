const input = document.querySelector('.urlInput');
const url = document.querySelector('.urlInput').value.trim();
const urlRegexp = /https?:\/\/(.+)/;

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        if (url.match(urlRegexp) || url.includes('.') || url.substring(0, 1) === '') {
            const g = window.open();

            g.document.head.innerHTML = 
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

            g.document.body.innerHTML =
                `
                    <iframe is="x-frame-bypass" src="${url}" class="frame"></iframe>
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
        } else if (url.match(urlRegexp) || url.includes('.')) {
            const g = window.open();

            g.document.head.innerHTML = 
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

            g.document.body.innerHTML =
                `
                    <iframe is="x-frame-bypass" src="https://${url}" class="frame"></iframe>
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
        }
    }
});