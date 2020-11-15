export default function GET(path, onSuccess, onError) {

    let errorOccurred = false;
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const init = {
        method: 'GET',
        headers: headers,
        cache: 'default',
        // mode: 'no-cors'
    };

    function log(promise) {
        console.log("GET, path: ", path);
        console.log("GET, promise: ", promise);
        return promise;
    }

    function resolve(promise) {
        console.log("GET, resolve, promise: ", promise);
        return Promise.resolve(promise);
    }

    function checkStatus(response) {
        if (!response.ok) {
            errorOccurred = true;
            onError('Wystąpił błąd. Status odpowiedzi: ' + response.status);
            return null;
        }
        return response;
    }

    function getJson(response) {
        console.log("GET, getJson, response: ", response);
        if (response == null)
            return null;
        const contentType = response.headers.get('content-type');
        // console.log("GET, getJson, contentType: ", contentType);
        // if (!contentType || !contentType.includes('application/json')) {
        //     errorOccurred = true;
        //     throw new TypeError("Oops, we haven't got JSON!"); 
        // }
        return response.json();
    }

    //dzieki wrapperowi onSuccess nie wykonuje się gdy na przykład nie ma nagłówka application/json
    //ale rzucenie wyjątku nie wystarczy, by wykonało się onError!
    function onSuccessWrapper(json) {
        if(!errorOccurred)
            onSuccess(json)
    }

    fetch(path)
        .then(log)
        .then(resolve)
        .then(checkStatus)
        .then(getJson)
        .then(onSuccessWrapper)
        .catch(onError)
    //Następujący błąd występujący w Firefoxie:
    //Błąd mapy źródła: Error: NetworkError when attempting to fetch resource.
    //należy zignorować, wynika z buga w tej przeglądarce
}
