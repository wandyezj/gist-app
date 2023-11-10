import { website, clock } from "./website";
clock();
console.log(website());

// HTML element ids
const inputClientId = "input_client_id";
const inputClientSecret = "input_client_secret";
const buttonSaveClient = "button_save_client";
const buttonAuth = "button_auth";

// Local storage keys
const localStorageKeyClientId = "client_id";
const localStorageKeyClientSecret = "client_secret";
const localStorageKeyAccessToken = "access_token";
const localStorageKeyRefreshToken = "refresh_token";

type LocalStorageKey =
    | typeof localStorageKeyClientId
    | typeof localStorageKeyClientSecret
    | typeof localStorageKeyAccessToken
    | typeof localStorageKeyRefreshToken;

function setKey(key: LocalStorageKey, value: string) {
    window.localStorage.setItem(key, value);
}

function getKey(key: LocalStorageKey): string | undefined {
    return window.localStorage.getItem(key) || undefined;
}

function clickButtonSaveClient() {
    const clientId = (document.getElementById(inputClientId) as HTMLInputElement).value;
    setKey(localStorageKeyClientId, clientId);

    const clientSecret = (document.getElementById(inputClientSecret) as HTMLInputElement).value;
    setKey(localStorageKeyClientSecret, clientSecret);
}

// Retrieve from the input fields instead? That way they are visible?
function getClientId(): string | undefined {
    return getKey(localStorageKeyClientId);
}

function getClientSecret(): string | undefined {
    return getKey(localStorageKeyClientSecret);
}

// TODO: implement calls to get auth token and use it to get data from the API

function clickButtonAuth() {
    console.log("clickButtonAuth");
    const clientId = getClientId();

    if (!clientId) {
        console.log("Missing client ID");
        return;
    }

    // TODO: specify redirect URL (these need to be registered in the application)

    const redirectUri = window.location.href;
    console.log(`redirectUri: ${redirectUri}`);

    const queryString = new URLSearchParams([
        ["client_id", clientId],
        //["redirect_uri", redirectUri],
    ]).toString();

    window.location.href = `https://github.com/login/oauth/authorize?${queryString}`;
}

async function getAccessToken(code: string) {
    console.log("getAccessToken");
    // TODO: add spinner while waiting for response

    const clientId = getClientId();
    const clientSecret = getClientSecret();

    if (!clientId || !clientSecret || !code) {
        console.log("Missing client ID or client secret or code");
        return;
    }

    const queryString = new URLSearchParams([
        ["client_id", clientId],
        ["client_secret", clientSecret],
        ["code", code],
    ]).toString();

    console.log("fetch");
    const response = await fetch(`https://github.com/login/oauth/access_token?${queryString}`, {
        method: "post",
        headers: {
            mode: "no-cors",
        },
    });

    console.log(`status: ${response.status}`);
    const data = await response.json();
    console.log(data);

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    if (accessToken) {
        setKey(localStorageKeyAccessToken, accessToken);
    }

    if (refreshToken) {
        setKey(localStorageKeyRefreshToken, refreshToken);
    }
}

function initialize() {
    // check for code in URL
    const code = new URLSearchParams(window.location.search).get("code");
    if (code) {
        getAccessToken(code);
    }

    // display previously saved values
    const clientId = getClientId();
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
