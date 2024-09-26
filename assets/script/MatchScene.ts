import { _decorator, Component, Node, Button, Label, director } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('MatchScene')
export class MatchScene extends Component {

    @property(Button)
    startMatchButton: Button = null;

    @property(Label)
    matchingLabel: Label = null;

    private ws: WebSocket;

    start() {
        this.startMatchButton.node.on('click', this.onStartMatch, this);
        this.connectWebSocket();
        this.matchingLabel.node.active = false; // 初始隐藏匹配中的文字
    }

    connectWebSocket() {
        this.ws = new WebSocket('ws://localhost:8080');

        this.ws.onopen = () => {
            console.log('Connected to server');
        };

        this.ws.onmessage = (event) => {
            const data = JSON.parse(event.data);
            this.handleServerMessage(data);
        };

        this.ws.onclose = () => {
            console.log('Disconnected from server');
        };
    }

    handleServerMessage(data: any) {
        if (data.action === 'matchSuccess') {
            console.log('Match successful, entering game');
            this.matchingLabel.node.active = false; // 隐藏匹配中的文字
            director.loadScene('mainscene'); // 假设游戏场景名为 'GameScene'
        }
    }

    onStartMatch() {
        this.matchingLabel.node.active = true; // 显示匹配中的文字
        this.ws.send(JSON.stringify({ action: 'startMatch' }));
    }
}