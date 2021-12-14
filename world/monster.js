export default class Monster extends Phaser.Physics.Arcade.Image {
    constructor(scene, x, y, texture) {
        super(scene, x, y, texture)
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.speed = 45
    }
    static preload(scene) {
        scene.load.image('monster', 'sprites/world/monster.png')
    }
    update() {
        this.scene.physics.moveToObject(
            this,
            {
                x: this.scene.player.body.x,
                y: this.scene.player.body.y
            },
            this.speed
        )
        this.scene.physics.overlap(this, this.scene.player, () => {
            this.scene.events.emit('monster-encounter', this)
        })
    }
}
