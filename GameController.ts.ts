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

    private bulletCount: number = 0;
    private isDefending: boolean = false;
    private opponentBulletCount: number = 0;
    private opponentIsDefending: boolean = false;
    private ws: any = null;

    start() {
        this.addBulletButton.node.on('click', this.onAddBullet, this);
        this.shootButton.node.on('click', this.onShoot, this);
        this.defendButton.node.on('click', this.onDefend, this);

        this.connectWebSocket();
    }

    connectWebSocket() {
        // @ts-ignore
        this.ws = wx.connectSocket({
            url: 'ws://localhost:8080',
            success: () => {
                console.log('Connected to server');
            },
            fail: (err) => {
                console.error('Failed to connect to server', err);
            }
        });

        // @ts-ignore
        this.ws.onMessage((event) => {
            const data = JSON.parse(event.data);
            this.handleOpponentAction(data);
        });

        // @ts-ignore
        this.ws.onClose(() => {
            console.log('Disconnected from server');
        });
    }

    handleOpponentAction(data: any) {
        if (data.action === 'shoot' && !this.isDefending) {
            this.showResult('你输了！');
        }
        // 处理其他动作
    }

    onAddBullet() {
        this.bulletCount += 1;
        this.updateBulletCount();
    }

    onShoot() {
        if (this.bulletCount > 0) {
            this.bulletCount -= 1;
            // @ts-ignore
            this.ws.send({
                data: JSON.stringify({ action: 'shoot' })
            });
            if (!this.opponentIsDefending) {
                this.showResult('你赢了！');
            }
        }
        this.updateBulletCount();
    }

    onDefend() {
        this.isDefending = true;
        this.scheduleOnce(() => {
            this.isDefending = false;
        }, 10);
    }

    updateBulletCount() {
        this.bulletCountLabel.string = `子弹数: ${this.bulletCount}`;
    }

    showResult(result: string) {
        this.resultLabel.string = result;
        this.unscheduleAllCallbacks();
    }
}