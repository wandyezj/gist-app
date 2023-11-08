import { website, clock } from "./website";
clock();
console.log(website());

const localStorageKeyClientSecret = "client_secret";

function buttonSaveClientSecret() {
    const clientSecret = (document.getElementById("input_client_secret") as HTMLInputElement).value;
    window.localStorage.setItem(localStorageKeyClientSecret, clientSecret);
}

function getClientSecret(): string | undefined {
    return window.localStorage.getItem(localStorageKeyClientSecret) || undefined;
}

function initialize() {
    // allow saving of client secret
    (document.getElementById("button_save_client_secret") as HTMLButtonElement).addEventListener(
        "click",
        buttonSaveClientSecret
    );

    // display previously saved secret
    const clientSecret = getClientSecret();
    if (clientSecret) {
        (document.getElementById("input_client_secret") as HTMLInputElement).value = clientSecret;
    }
}

// TODO: implement calls to get auth token and use it to get data from the API

initialize();
