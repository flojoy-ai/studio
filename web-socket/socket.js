const {Server} = require('socket.io');

class WebSocketServer {
    #server;
    #socket;
    pingResponse
    constructor(server, pingResponse){
        this.pingResponse = pingResponse;
        this.#server = new Server(server,{cors:{
            origin: '*'
        }});
        this.init();
    }
    init(){
        this.#server.on('connection', (socket)=> {
            this.#socket = socket;
            this.#socket.on('ping', ()=>{
                if(this.pingResponse){
                   this.pingResponse(this.#socket)
                }
            })
        })
    }
    sendSystemStatus(status){
        if(this.#socket){
            this.#socket.emit('system-status', status)
        }
    }
    returnResult(result){
        if(this.#socket){
            this.#socket.emit('program-results', result)
        }
    }
}
module.exports = WebSocketServer;