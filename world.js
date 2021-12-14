import Player from './world/player.js'
import Monster from './world/monster.js'

export default class World extends Phaser.Scene {
    constructor(game) {
        super()
        this.game = game
        Phaser.Scene.call(this, { key: 'World' })
    }
    init(data) {
        this.data = data
        this.hasMonster = false
        this.monsters = []
    }
    preload() {
        this.load.setBaseURL('assets/')
        this.load.image('worldtiles', 'tilemaps/world/zeldaTiles.png')
        this.load.tilemapTiledJSON('world', 'tilemaps/world/Overworld.json')
        Monster.preload(this)
        Player.preload(this)
    }
    create() {
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            hit: Phaser.Input.Keyboard.KeyCodes.E,
            shift: Phaser.Input.Keyboard.KeyCodes.SHIFT
        })

        let map = this.make.tilemap({
            key: 'world',
            tileWidth: 16,
            tileHeight: 16
        })
        let tileset = map.addTilesetImage('AoLOverTiles', 'worldtiles', 16, 16)
        this.layer = map.createLayer('Kachelebene 1', tileset, 0, 0)
        this.objectLayer = map.createFromObjects('Objektebene 1')
        this.layer.setCollisionByProperty({ collides: true })
        this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels)
        this.cameras.roundPixels = true
        this.bounds = this.physics.world.setBounds(
            0,
            0,
            map.widthInPixels,
            map.heightInPixels,
            true,
            true,
            true,
            true
        )
        this.player = new Player(
            this,
            this.data.x || 48,
            this.data.y || 32,
            'link'
        )
        this.objectLayer.forEach((object) => {
            if (object.getData('town')) {
                this.physics.add.existing(object)
            }
        })
        this.player.setCollideWorldBounds(true)
        this.physics.add.collider(
            this.player,
            this.layer,
            this.tileHit,
            null,
            this
        )
        this.physics.add.overlap(
            this.player,
            this.objectLayer,
            (player, object) => {
                console.log(object)
            },
            null,
            this
        )
        this.physics.add.overlap(
            this.player,
            this.layer,
            this.tileOverlap,
            null,
            this
        )
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setZoom(8)

        this.events.on('monster-encounter', () => {
            this.scene.start('Scroller', { tile: null, player: this.player })
        })
    }
    update() {
        this.player.update()
        this.monsters.forEach((monster) => {
            monster.update()
        })
    }
    tileHit(player, tile) {
        if ('warp' in tile.properties) {
            this.scene.start('Scroller', { tile, player })
        }
    }
    tileOverlap(player, tile) {
        if ('monster' in tile.properties) {
            if (!this.hasMonster) {
                this.hasMonster = true
                this.time.addEvent({
                    delay: Phaser.Math.Between(1000, 10000),
                    callback() {
                        for (let i = 0; i < Phaser.Math.Between(1, 3); i++) {
                            this.monsters.push(
                                new Monster(
                                    this,
                                    Phaser.Math.Between(
                                        this.player.body.x - 32,
                                        this.player.body.x + 32
                                    ),
                                    Phaser.Math.Between(
                                        this.player.body.y - 32,
                                        this.player.body.y + 32
                                    ),
                                    'monster'
                                )
                            )
                        }
                    },
                    repeat: 0,
                    callbackScope: this
                })
            }
        }
    }
}
