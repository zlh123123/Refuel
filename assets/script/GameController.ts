// import { _decorator, Component, Node, Button, Label } from 'cc';
// const { ccclass, property } = _decorator;

// @ccclass('GameController')
// export class GameController extends Component {

//     @property(Button)
//     addBulletButton: Button = null;

//     @property(Button)
//     shootButton: Button = null;

//     @property(Button)
//     defendButton: Button = null;

//     @property(Label)
//     bulletCountLabel: Label = null;

//     @property(Label)
//     resultLabel: Label = null;

//     @property(Label)
//     roundLabel: Label = null;

//     private bulletCount: number = 0;
//     private isDefending: boolean = false;
//     private ws: WebSocket;
//     private actions: any = {};
//     private round: number = 1;
//     private hasActed: boolean = false;
//     private roundTimer: number = 10;

//     start() {
//         this.addBulletButton.node.on('click', this.onAddBullet, this);
//         this.shootButton.node.on('click', this.onShoot, this);
//         this.defendButton.node.on('click', this.onDefend, this);

//         this.connectWebSocket();
//         this.updateRoundLabel();
//         this.startRoundTimer();
//     }

//     connectWebSocket() {
//         this.ws = new WebSocket('ws://localhost:8080');

//         this.ws.onopen = () => {
//             console.log('Connected to server');
//         };

//         this.ws.onmessage = (event) => {
//             const data = JSON.parse(event.data);
//             this.handleServerMessage(data);
//         };

//         this.ws.onclose = () => {
//             console.log('Disconnected from server');
//         };
//     }
//     handleServerMessage(data: any) {
//         switch (data.action) {
//             case 'roundResult':
//                 this.handleRoundResult(data);
//                 break;
//             case 'updateRound':
//                 this.updateRound(data.round);
//                 break;
//             default:
//                 console.error('Unknown action:', data.action);
//                 break;
//         }
//     }
    
//     updateRound(newRound: number) {
//         this.round = newRound;
//         this.updateRoundLabel();
//     }

//     handleRoundResult(data: any) {
//         if (data.result === 'win') {
//             this.showResult('你赢了！');
//         } else if (data.result === 'lose') {
//             this.showResult('你输了！');
//         } else if (data.result === 'continue') {
//             this.showResult('双方开枪，继续游戏！');
//         }
//         this.resetActions();
//         this.round += 1;
//         this.updateRoundLabel();
//         this.hasActed = false;
//         this.startRoundTimer();
//     }

//     onAddBullet() {
//         if (this.hasActed) return;
//         this.actions.addBullet = true;
//         this.bulletCount += 1;
//         this.updateBulletCount();
//         this.sendActions();
//         this.hasActed = true;
//     }

//     onShoot() {
//         if (this.hasActed || this.bulletCount <= 0) return;
//         this.actions.shoot = true;
//         this.bulletCount -= 1;
//         this.updateBulletCount();
//         this.sendActions();
//         this.hasActed = true;
//     }

//     onDefend() {
//         if (this.hasActed) return;
//         this.actions.defend = true;
//         this.isDefending = true;
//         this.sendActions();
//         this.hasActed = true;
//     }

//     sendActions() {
//         this.ws.send(JSON.stringify({ action: 'playerAction', actions: this.actions }));
//     }

//     updateBulletCount() {
//         this.bulletCountLabel.string = `子弹数: ${this.bulletCount}`;
//     }

//     updateRoundLabel() {
//         this.roundLabel.string = `回合数: ${this.round}`;
//     }

//     showResult(result: string) {
//         this.resultLabel.string = result;
//         this.unscheduleAllCallbacks();
//     }

//     resetActions() {
//         this.actions = {};
//         this.isDefending = false;
//     }

//     startRoundTimer() {
//         this.roundTimer = 10;
//         this.schedule(this.updateRoundTimer, 1);
//     }

//     updateRoundTimer() {
//         this.roundTimer -= 1;
//         if (this.roundTimer <= 0) {
//             this.unschedule(this.updateRoundTimer);
//             this.endRound();
//         }
//     }

//     endRound() {
//         if (!this.hasActed) {
//             this.ws.send(JSON.stringify({ action: 'playerAction', actions: { lose: true } }));
//         } else {
//             this.ws.send(JSON.stringify({ action: 'endRound' }));
//         }
//     }
// }
import { _decorator, Component, Node, Button, Label } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('GameController')
export class GameController extends Component {

    @property(Button)
    addBulletButton: Button = null;

    @property(Button)
    shootButton: Button = null;

    @property(Button)
    defendButton: Button = null;

    @property(Label)
    bulletCountLabel: Label = null;

    @property(Label)
    resultLabel: Label = null;

    @property(Label)
    roundLabel: Label = null;

    private bulletCount: number = 0;
    private isDefending: boolean = false;
    private ws: WebSocket;
    private actions: any = {};
    private round: number = 1;
    private hasActed: boolean = false;
    private roundTimer: number = 10;

    start() {
        this.addBulletButton.node.on('click', this.onAddBullet, this);
        this.shootButton.node.on('click', this.onShoot, this);
        this.defendButton.node.on('click', this.onDefend, this);

        this.connectWebSocket();
        this.updateRoundLabel();
        this.startRoundTimer();
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
        switch (data.action) {
            case 'roundResult':
                this.handleRoundResult(data);
                break;
            default:
                console.error('Unknown action:', data.action);
                break;
        }
    }

    handleRoundResult(data: any) {
        if (data.result === 'win') {
            this.showResult('你赢了！');
        } else if (data.result === 'lose') {
            this.showResult('你输了！');
        } else if (data.result === 'continue') {
            this.showResult('继续游戏！');
        }
        this.resetActions();
        this.round += 1;
        this.updateRoundLabel();
        this.hasActed = false;
        this.startRoundTimer();
    }

    onAddBullet() {
        if (this.hasActed) return;
        this.actions.addBullet = true;
        this.bulletCount += 1;
        this.updateBulletCount();
        this.sendActions();
        this.hasActed = true;
    }

    onShoot() {
        if (this.hasActed || this.bulletCount <= 0) return;
        this.actions.shoot = true;
        this.bulletCount -= 1;
        this.updateBulletCount();
        this.sendActions();
        this.hasActed = true;
    }

    onDefend() {
        if (this.hasActed) return;
        this.actions.defend = true;
        this.isDefending = true;
        this.sendActions();
        this.hasActed = true;
    }

    sendActions() {
        this.ws.send(JSON.stringify({ action: 'playerAction', actions: this.actions }));
    }

    updateBulletCount() {
        this.bulletCountLabel.string = `子弹数: ${this.bulletCount}`;
    }

    updateRoundLabel() {
        this.roundLabel.string = `回合数: ${this.round}`;
    }

    showResult(result: string) {
        this.resultLabel.string = result;
        this.unscheduleAllCallbacks();
    }

    resetActions() {
        this.actions = {};
        this.isDefending = false;
    }

    startRoundTimer() {
        this.roundTimer = 10;
        this.schedule(this.updateRoundTimer, 1);
    }

    updateRoundTimer() {
        this.roundTimer -= 1;
        if (this.roundTimer <= 0) {
            this.unschedule(this.updateRoundTimer);
            this.endRound();
        }
    }

    endRound() {
        if (!this.hasActed) {
            this.ws.send(JSON.stringify({ action: 'playerAction', actions: { lose: true } }));
        } else {
            this.ws.send(JSON.stringify({ action: 'endRound' }));
        }
    }
}