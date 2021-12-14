export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture)
        this.setOrigin(0)
        scene.add.existing(this)
        scene.physics.add.existing(this)

        this.speed = 50

        this.scene.anims.create({
            key: 'player-idle',
            frames: this.scene.anims.generateFrameNumbers('link', {
                frames: [0]
            })
        })
        this.scene.anims.create({
            key: 'player-walkleft',
            frames: this.scene.anims.generateFrameNumbers('link', {
                frames: [4, 5]
            }),
            frameRate: 8,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'player-walkright',
            frames: this.scene.anims.generateFrameNumbers('link', {
                frames: [7, 6]
            }),
            frameRate: 8,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'player-walkup',
            frames: this.scene.anims.generateFrameNumbers('link', {
                frames: [10, 11]
            }),
            frameRate: 8,
            repeat: -1
        })
        this.scene.anims.create({
            key: 'player-walkdown',
            frames: this.scene.anims.generateFrameNumbers('link', {
                frames: [8, 9]
            }),
            frameRate: 8,
            repeat: -1
        })
    }
    static preload(scene) {
        scene.load.spritesheet('link', 'sprites/world/link.png', {
            frameWidth: 8,
            frameHeight: 16
        })
    }
    update() {
        this.body.setVelocity(0)

        if (this.scene.keys.shift.isDown) {
            this.speed = 100
        } else {
            this.speed = 50
        }
        if (this.scene.keys.left.isDown) {
            this.body.setVelocityX(-this.speed)
        } else if (this.scene.keys.right.isDown) {
            this.body.setVelocityX(this.speed)
        }
        if (this.scene.keys.up.isDown) {
            this.body.setVelocityY(-this.speed)
        } else if (this.scene.keys.down.isDown) {
            this.body.setVelocityY(this.speed)
        }

        if (this.scene.keys.left.isDown) {
            this.play('player-walkleft', true)
        } else if (this.scene.keys.right.isDown) {
            this.play('player-walkright', true)
        } else if (this.scene.keys.up.isDown) {
            this.play('player-walkup', true)
        } else if (this.scene.keys.down.isDown) {
            this.play('player-walkdown', true)
        } else {
            this.stop()
        }
    }
}
