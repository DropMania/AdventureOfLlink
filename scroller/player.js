export default class Player extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, 4)
        this.setOrigin(0)
        this.texture = texture
        scene.add.existing(this)
        scene.physics.add.existing(this)
        this.setSize(16, 32)
        this.body.setOffset(12, 0)
        this.speed = 50
        this.facing = 'right'
        this.duck = ''
        this.isAttacking = false
        this.swordHitbox = this.scene.add.rectangle(-100, -100, 16, 8)
        this.scene.physics.add.existing(this.swordHitbox)
        this.swordHitbox.setOrigin(0)
        this.swordHitbox.body.allowGravity = false
        this.health = 100
        this.playHit = false
        this.attackDamage = 10
        createAnimations(this)
        this.play('link-right-start')
        this.scene.keys.hit.on('down', () => {
            this.attack()
        })
        this.scene.keys.down.on('up', () => {
            this.duck = ''
            this.play('link-' + this.facing + '-start')
        })
    }
    static preload(scene) {
        scene.load.spritesheet('link-level', 'sprites/scroller/link.png', {
            frameWidth: 40,
            frameHeight: 40
        })
    }
    attack() {
        if (this.isAttacking) return
        this.isAttacking = true
        this.anims.play('link-' + this.facing + '-slash' + this.duck)
        this.swordHitbox.setX(this.facing === 'right' ? this.x + 24 : this.x)
        this.swordHitbox.setY(this.duck === '-duck' ? this.y + 18 : this.y + 8)

        this.scene.time.addEvent({
            delay: 100,
            callback: () => {
                this.swordHitbox.setPosition(-100, -100)
            }
        })
        this.scene.time.addEvent({
            delay: 300,
            callback: () => {
                this.isAttacking = false
                this.play('link-' + this.facing + '-start')
            }
        })
    }
    gotHit(damage, direction) {
        this.health -= damage
        this.playHit = true
        this.scene.events.emit('changeHealth', this.health)
        if (direction === 'left') {
            this.body.setVelocity(-this.speed * 3, -300)
            this.play('link-left-hit')
        } else {
            this.body.setVelocity(this.speed * 3, -300)
            this.play('link-right-hit')
        }
        this.scene.time.addEvent({
            delay: 400,
            callback: () => {
                this.playHit = false
                this.play('link-' + this.facing + '-start')
            }
        })
        if (this.health <= 0) {
            this.scene.scene.start('World')
        }
    }
    update() {
        if (
            this.anims.currentAnim.key !==
            'link-' + this.facing + '-slash' + this.duck
        ) {
            if (this.scene.keys.down.isDown) {
                this.setVelocityX(0)
                this.duck = '-duck'
                this.play('link-' + this.facing + '-duck', true)
            } else {
                if (!this.playHit) {
                    if (this.scene.keys.left.isDown) {
                        this.setVelocityX(-100)
                        this.anims.play('link-left', true)
                        this.facing = 'left'
                    } else if (this.scene.keys.right.isDown) {
                        this.setVelocityX(100)
                        this.anims.play('link-right', true)
                        this.facing = 'right'
                    } else {
                        this.setVelocityX(0)
                        this.anims.stop()
                    }
                }
                if (this.scene.keys.space.isDown && this.body.blocked.down) {
                    console.log('jump')
                    this.setVelocityY(-350)
                }
            }
        } else {
            this.setVelocityX(0)
        }
    }
}

function createAnimations(player) {
    player.anims.create({
        key: 'link-left-start',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [3]
        }),
        frameRate: 15,
        repeat: -1
    })
    player.anims.create({
        key: 'link-right-start',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [4]
        }),
        frameRate: 15,
        repeat: -1
    })
    player.anims.create({
        key: 'link-right',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [4, 5, 6, 7]
        }),
        frameRate: 15,
        repeat: -1
    })
    player.anims.create({
        key: 'link-left',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [3, 2, 1, 0]
        }),
        frameRate: 15,
        repeat: -1
    })
    player.anims.create({
        key: 'link-right-duck',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [14]
        }),
        frameRate: 15,
        repeat: -1
    })
    player.anims.create({
        key: 'link-left-duck',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [9]
        }),
        frameRate: 15,
        repeat: -1
    })
    player.anims.create({
        key: 'link-left-slash',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [11, 10]
        }),
        frameRate: 15,
        repeat: 0
    })
    player.anims.create({
        key: 'link-right-slash',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [12, 13]
        }),
        frameRate: 15,
        repeat: 0
    })
    player.anims.create({
        key: 'link-left-slash-duck',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [8]
        }),
        frameRate: 15,
        repeat: 0
    })
    player.anims.create({
        key: 'link-right-slash-duck',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [15]
        }),
        frameRate: 15,
        repeat: 0
    })
    player.anims.create({
        key: 'link-right-hit',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [16]
        }),
        frameRate: 15,
        repeat: 0
    })
    player.anims.create({
        key: 'link-left-hit',
        frames: player.anims.generateFrameNumbers(player.texture, {
            frames: [23]
        }),
        frameRate: 15,
        repeat: 0
    })
}
