const key = "AIzaSyCd01sS31s_q8gXkLVPUovxQJaOsV3diUU"
async function gspeech(...args) {
    const text = args[0]
    const res = await fetch(
        `https://texttospeech.googleapis.com/v1/text:synthesize?key=${key}`,
        {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                input: {
                    text: text,
                },
                voice: {
                    languageCode: "en-gb",
                    name: "en-GB-Standard-B",
                },
                audioConfig: {
                    audioEncoding: "MP3",
                },
            }),
        }
    )
    const info = await res.json()
    const dataURI = `data:audio/mp3;base64,${info.audioContent}`
    const audio = new Audio(dataURI)
    audio.play()
}

export default gspeech
