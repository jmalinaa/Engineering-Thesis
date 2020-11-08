import { BASE_PATH } from "./paths";

export default async function GET(relativePath, onSuccess, onError) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const init = {
        method: 'GET',
        headers: headers,
        cache: 'default'
    };

    // let response = await fetch(BASE_PATH + relativePath, init)
    // let json = await response.json;
    // return json;
    fetch(BASE_PATH + relativePath)
        .then((response) => onSuccess(response))
        .then(data => console.log("GET, data:", data))
}
