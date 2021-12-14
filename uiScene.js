export default class UIScene extends Phaser.Scene {
    constructor() {
        super({ key: 'UIScene', active: true })
    }

    create() {
        let health = this.add.text(10, 10, 'Health: 100', {
            font: '48px Arial',
            fill: '#000000'
        })

        let game = this.scene.get('Scroller')
        console.log(game)
        game.events.on(
            'changeHealth',
            function (val) {
                console.log(val)
                health.setText('Health: ' + val)
            },
            this
        )
    }
}
