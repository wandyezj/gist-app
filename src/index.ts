import { website, clock } from "./website";
clock();
console.log(website());

// HTML element ids
const inputClientId = "input_client_id";
const inputClientSecret = "input_client_secret";
const buttonSaveClient = "button_save_client";
const buttonAuth = "button_auth";

const localStorageKeyClientId = "client_id";
const localStorageKeyClientSecret = "client_secret";

function clickButtonSaveClient() {
    const clientId = (document.getElementById(inputClientId) as HTMLInputElement).value;
    window.localStorage.setItem(localStorageKeyClientId, clientId);

    const clientSecret = (document.getElementById(inputClientSecret) as HTMLInputElement).value;
    window.localStorage.setItem(localStorageKeyClientSecret, clientSecret);
}

// Retrieve from the input fields instead? That way they are visible?
function getClientId(): string | undefined {
    return window.localStorage.getItem(localStorageKeyClientId) || undefined;
}

function getClientSecret(): string | undefined {
    return window.localStorage.getItem(localStorageKeyClientSecret) || undefined;
}

// TODO: implement calls to get auth token and use it to get data from the API

function clickButtonAuth() {
    const clientId = getClientId();

    // TODO: specify redirect URL (these need to be registered in the application)
    window.location.href = `https://github.com/login/oauth/authorize?client_id=${clientId}`;
}

function initialize() {
    // TODO: check for code in URL

    // display previously saved values
    const clientId = getClientSecret();
    if (clientId) {
        (document.getElementById(inputClientId) as HTMLInputElement).value = clientId;
    }

    const clientSecret = getClientSecret();
    if (clientSecret) {
        (document.getElementById(inputClientSecret) as HTMLInputElement).value = clientSecret;
    }

    // allow saving of client secret
    (document.getElementById(buttonSaveClient) as HTMLButtonElement).addEventListener("click", clickButtonSaveClient);
    (document.getElementById(buttonAuth) as HTMLButtonElement).addEventListener("click", clickButtonAuth);
}

initialize();
