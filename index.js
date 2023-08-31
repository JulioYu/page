let server = null;
let isConnected = false;

function link() {
    if(!isConnected){
        const port = document.getElementById('port').value || '1042';
        const url = `ws://127.0.0.1:${port}?role=Pager`;

        server = new WebSocket(url);
        server.onopen = () => {
            console.log('connected');

            isConnected = true;
        };
        server.onerror = () => {
            console.log('connection error');
        };
        server.onmessage = (evt) => {
            console.log(JSON.stringify(evt?.data, null, 4));
        };
    }
}

function send() {
    if(server){
        const text = document.getElementById('payload').value || '';

        server.send(JSON.stringify(text));
    }
}

function getVersion() {
    const text = document.getElementById('payload');

    fetch('http://127.0.0.1:5000/api/1/version')
        .then((response) => response.arrayBuffer())
        .then((result) => {
            try {
                const data = String.fromCharCode.apply(null, new Uint16Array(result));

                text.value = data;
            } catch (e) {
                throw new Error(e);
            }
        })
        .catch((result) => {
            text.value = result;
        });
}

window.onload = function () {
    const connectWebsocketButton = document.getElementById('connectWebsocket');
    const sendMessageButton = document.getElementById('sendMessage');
    const getVersionButton = document.getElementById('getVersion');

    connectWebsocketButton.onclick = () => {
        link();
    };
    sendMessageButton.onclick = () => {
        send();
    };
    getVersionButton.onclick = () => {
        getVersion();
    };


    document.getElementById('payload').value = JSON.stringify({
        command: 'broadcastEvent',
        target: {
            role: 'Pager',
        },
        msg: {
            id: '123',
            text: '123',
        }
    }, undefined, 4);

}