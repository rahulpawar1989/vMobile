//use this file for communication between client and server
const net = require('net');
const PORT = 2833;

const server = new net.Server();
const client = new net.Socket();

function init(sendmsg) {
    server.on('connection', (socket) => {
        socket.write('Echo server\r\n');
    });

    server.listen({ port: PORT,
         host: '192.168.0.103', 
         //host: '192.168.1.1', 
         //reuseAddress: true
         });

    client.connect(
        // @ts-ignore
        {
            port: PORT,
             host: '192.168.0.103', 
            //host: '192.168.1.1', 
            //localAddress: '127.0.0.1',
           // reuseAddress: true,
            // localPort: 20000,
            // interface: "wifi",
            // tls: true
        },
        () => {
            client.write(sendmsg);
        }
    );

    
}

module.exports = { init, server, client };
