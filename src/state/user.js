import jwtDecode from "jwt-decode"

const userInfo = () => {
    const url = new URL(document.location.href.toString().replace("#", "?"))

    const hasInfo = (
        url.searchParams.has("id_token")
        && url.searchParams.has("access_token")
    )
    if (hasInfo === false) {
        return null
    }

    const idToken = url.searchParams.get("id_token")
    const accessToken = url.searchParams.get("access_token")
    const info = jwtDecode(idToken)

    sessionStorage.relog = "true"
    history.replaceState(null, document.title, location.origin)

    return {
        info,
        token: {
            id: idToken,
            access: accessToken,
        }
    }
}

export default userInfo()
