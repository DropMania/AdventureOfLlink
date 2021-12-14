import Monster from '../monster.js'
export default class Skeleton extends Monster {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        this.setSize(16, 32)
        this.body.setOffset(16, 0)
        this.speed = 50
        this.swordHitbox = null
        this.playingAttack = false
        this.isAttacking = false
        this.fightRadius = 50
        this.play('left')
        createAnimations(this)
        let walkEvent = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                if (!this.seePlayer) {
                    this.speed = Math.random() > 0.5 ? -this.speed : this.speed
                }
                if (this.isDead) {
                    walkEvent.destroy()
                }
            },
            callbackScope: this,
            loop: true
        })
    }
    static preload(scene) {
        scene.load.spritesheet('skeleton', 'sprites/scroller/skeleton.png', {
            frameWidth: 48,
            frameHeight: 32
        })
    }
    attack() {
        if (this.isAttacking) return
        this.isAttacking = true
        this.playingAttack = true
        let gotHit = false
        this.swordHitbox = this.scene.add.rectangle(
            this.facing === 'right' ? this.x + 34 : this.x - 2,
            this.y + 8,
            16,
            8
        )
        this.swordHitbox.setOrigin(0)
        this.scene.physics.add.existing(this.swordHitbox, true)
        this.play(this.playerIsRight ? 'attack-right' : 'attack-left', true)
        let swordCollider = this.scene.physics.add.overlap(
            this.swordHitbox,
            this.scene.player,
            () => {
                if (!gotHit) {
                    this.scene.player.gotHit(
                        this.attackDamage,
                        this.playerIsRight ? 'right' : 'left'
                    )
                    gotHit = true
                }
            }
        )
        let colliderTimer = this.scene.time.addEvent({
            delay: 200,
            callback: () => {
                this.playingAttack = false
                this.swordHitbox.destroy()
                swordCollider.destroy()
                colliderTimer.destroy()
            }
        })
        let attackingTimer = this.scene.time.addEvent({
            delay: 1000,
            callback: () => {
                this.isAttacking = false
                attackingTimer.destroy()
            }
        })
    }
    update() {
        if (!this.isDead) {
            super.update()
            this.body.setVelocityX(this.speed)
            if (!this.playingAttack) {
                if (this.facing === 'left') {
                    this.anims.play('left', true)
                } else {
                    this.anims.play('right', true)
                }
            }
            if (this.seePlayer) {
                if (this.playerIsRight) {
                    this.speed = 50
                } else {
                    this.speed = -50
                }
            }
            if (
                (this.body.blocked.right || this.body.blocked.left) &&
                this.seePlayer &&
                this.body.blocked.down
            ) {
                this.body.setVelocityY(-350)
            }
            if (this.inFightRange && this.scene.player.isAttacking) {
                this.body.setVelocityX(this.playerIsRight ? -100 : 100)
            }
            if (this.inFightRange) {
                this.attack()
            }
        }
    }
}

function createAnimations(monster) {
    monster.anims.create({
        key: 'left',
        frames: monster.anims.generateFrameNumbers(monster.texture, {
            frames: [13, 12]
        }),
        frameRate: 15,
        repeat: -1
    })
    monster.anims.create({
        key: 'right',
        frames: monster.anims.generateFrameNumbers(monster.texture, {
            frames: [0, 1]
        }),
        frameRate: 15,
        repeat: -1
    })
    monster.anims.create({
        key: 'attack-right',
        frames: monster.anims.generateFrameNumbers(monster.texture, {
            frames: [2, 3, 4]
        }),
        frameRate: 20,
        repeat: 0
    })
    monster.anims.create({
        key: 'attack-left',
        frames: monster.anims.generateFrameNumbers(monster.texture, {
            frames: [11, 10, 9]
        }),
        frameRate: 20,
        repeat: 0
    })
}
