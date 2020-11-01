import { BASE_PATH } from "./paths";

export default function GET(relativePath, onSuccess, onError) {

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const init = {
        method: 'GET',
        headers: headers,
        cache: 'default'
    };

    fetch(BASE_PATH + relativePath, init)
        .then(onSuccess())
        .catch(onError());
}
