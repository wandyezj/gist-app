async function getAccessToken(clientId, clientSecret, code) {
    console.log("getAccessToken");

    if (!clientId || !clientSecret || !code) {
        console.log("Missing client ID or client secret or code");
        return;
    }

    const queryString = new URLSearchParams([
        ["client_id", clientId],
        ["client_secret", clientSecret],
        ["code", code],
    ]).toString();

    const url = `https://github.com/login/oauth/access_token?${queryString}`;
    console.log("fetch");
    console.log(url);
    const response = await fetch(url, {
        method: "post",
    });

    console.log(`status: ${response.status}`);
    const data = await response.json();
    console.log(data);

    const accessToken = data.access_token;
    const refreshToken = data.refresh_token;

    console.log(`access_token: ${accessToken}`);
    console.log(`refresh_token: ${refreshToken}`);
}

async function main() {
    const [clientId, clientSecret, code] = process.argv.slice(2);
    console.log(`clientId: ${clientId}`);
    console.log(`clientSecret: ${clientSecret}`);
    console.log(`code: ${code}`);
    await getAccessToken(clientId, clientSecret, code);
}

main();
