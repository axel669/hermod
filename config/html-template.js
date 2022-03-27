const template = (options) => `<!doctype html>
<html>
    <head>
        <title>${options.title}</title>
        <meta charset="utf-8" />
        <meta name="viewport" content="initial-scale=1,maximum-scale=1,minimum-scale=1,width=device-width" />
        <link rel="icon" type="image/png" href="https://axel669.net/images/megaman-rounded.png" />

        <script src="https://cdn.jsdelivr.net/npm/@axel669/twitch@1.0.5/dist/twitch.js"></script>
        <script src="https://code.responsivevoice.org/responsivevoice.js?key=TQIEjrYE"></script>
    </head>

    <body>
        <script src="${options.files.js[0].fileName}"></script>
    </body>
</html>
`

export default template
