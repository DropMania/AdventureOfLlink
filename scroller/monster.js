export default class Monster extends Phaser.Physics.Arcade.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame)
        this.setOrigin(0)
        this.texture = texture
        this.scene.add.existing(this)
        this.scene.physics.add.existing(this)
        this.scene.physics.add.collider(this, scene.groundLayer)
        this.facing = 'left'
        this.seeRadius = 100
        this.fightRadius = 30
        this.seePlayer = false
        this.inFightRange = false
        this.playerIsRight = false
        this.isAttacking = false
        this.health = 100
        this.maxHealth = 100
        this.attackDamage = 10
        this.isDead = false
        this.speed = 50
        this.healthText = this.scene.add.text(
            this.x + 10,
            this.y - 8,
            `${this.health}/${this.maxHealth}`,
            {
                fontSize: '7px',
                fill: '#fff',
                align: 'center',
                fontFamily: 'sans-serif',
            }
        )
        this.isHit = false
        this.hitCollider = this.scene.physics.add.overlap(
            this,
            this.scene.player.swordHitbox,
            this.gotHit,
            null,
            this
        )
    }
    gotHit() {
        if (!this.isHit) {
            this.isHit = true
            this.health -= this.scene.player.attackDamage
            this.body.setVelocity(
                this.playerIsRight ? -this.speed*3 : this.speed*3,
                -300
            )
            this.setTint(0xff0000)
            let hitEvent = this.scene.time.addEvent({
                delay: 200,
                callback: () => {
                    this.isHit = false
                    this.clearTint()
                    hitEvent.destroy()

                }
            })
            if (this.health <= 0) {
                this.isDead = true
                this.destroy()
                this.healthText.destroy()
                this.hitCollider.destroy()
            }
        }
    }
    update() {
        this.healthText.setPosition(this.x + 10, this.y - 8)
        this.healthText.setText(`${this.health}/${this.maxHealth}`)
        if (this.body.deltaX() < 0) {
            this.facing = 'left'
        } else {
            this.facing = 'right'
        }
        if (
            Phaser.Math.Distance.BetweenPoints(this, this.scene.player) <
            this.seeRadius
        ) {
            this.seePlayer = true
        } else {
            this.seePlayer = false
        }
        if (
            Phaser.Math.Distance.BetweenPoints(this, this.scene.player) <
            this.fightRadius
        ) {
            this.inFightRange = true
        } else {
            this.inFightRange = false
        }
        this.playerIsRight = this.scene.player.x > this.x
    }
}
