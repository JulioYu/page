// CSRF Token
const token = generateUUID();

document.cookie = `csrf-token=${token}`;

window.onload = function () {
    const sendAgentButton = document.getElementById('send2Agent');
    const sendServerButton = document.getElementById('send2Server');
    const serverURI = document.getElementById('serverURI');

    serverURI.value = window.location.origin + '/api/1/version';

    sendAgentButton.onclick = () => {
        sendAgent();
    };
    sendServerButton.onclick = () => {
        sendServer();
    };
}

function sendAgent() {
    const uri = document.getElementById('agentURI');
    const method = document.getElementById('agentMethod');
    const payload = document.getElementById('agentPayload');
    const response = document.getElementById('agentResponse');
    const methodValue = method.value;

    fetch(uri.value, {
        method: methodValue,
        ...(methodValue === 'post') && {
            body: payload.value,
        },
        mode: 'no-cors',
    })
        .then((res) => res.json())
        .then((result) => {
            try {
                response.value = result;
            } catch (e) {
                throw new Error(e);
            }
        })
        .catch((result) => {
            response.value = result;
        });
}

function sendServer() {
    const uri = document.getElementById('serverURI');
    const method = document.getElementById('serverMethod');
    const payload = document.getElementById('serverPayload');
    const response = document.getElementById('serverResponse');
    const methodValue = method.value;

    fetch(uri.value, {
        method: methodValue,
        ...(methodValue === 'post') && {
            body: payload.value,
        },
        headers: {
            'XSRF-TOKEN': token,
        },
    })
        .then((res) => res.arrayBuffer())
        .then((result) => {
            try {
                const data = String.fromCharCode.apply(null, new Uint16Array(result));

                response.value = data;
            } catch (e) {
                throw new Error(e);
            }
        })
        .catch((result) => {
            response.value = result;
        });
}

function generateUUID() {
    let d = Date.now();

    if (typeof performance !== 'undefined' && typeof performance.now === 'function') {
        d += performance.now();
    }

    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);

        return (c === 'x' ? r : ((r && 0x3) || 0x8)).toString(16);
    });
}