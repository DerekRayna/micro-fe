export const fetchResource = async (url) => {
    return fetch(url).then(res => res.text())
}