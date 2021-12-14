import Player from './scroller/player.js'
import Skeleton from './scroller/monsters/skeleton.js'

export default class Scroller extends Phaser.Scene {
    constructor(game) {
        super()
        this.game = game
        Phaser.Scene.call(this, { key: 'Scroller' })
    }
    init(data) {
        this.data = data
        this.physics.world.gravity.y = 1000
    }
    preload() {
        this.load.setBaseURL('assets/')
        this.load.image('tiles', 'tilemaps/level1/level1Tiles.png')
        this.load.tilemapCSV('map', 'tilemaps/level1/level1.csv')
        Player.preload(this)
        Skeleton.preload(this)
    }
    create() {
        this.cameras.main.setBackgroundColor('#000')
        let map = this.make.tilemap({
            key: 'map',
            tileWidth: 16,
            tileHeight: 16
        })
        map.setCollision([0, 1, 3, 4, 99])
        this.keys = this.input.keyboard.addKeys({
            left: Phaser.Input.Keyboard.KeyCodes.A,
            right: Phaser.Input.Keyboard.KeyCodes.D,
            up: Phaser.Input.Keyboard.KeyCodes.W,
            down: Phaser.Input.Keyboard.KeyCodes.S,
            space: Phaser.Input.Keyboard.KeyCodes.SPACE,
            hit: Phaser.Input.Keyboard.KeyCodes.E
        })

        let tileset = map.addTilesetImage('tiles')
        this.groundLayer = map.createLayer(0, tileset, 0, 0)
        this.player = new Player(this, (map.width / 2) * 16, 16, 'link-level')
        this.cameras.main.setBounds(
            16,
            0,
            map.widthInPixels - 32,
            map.heightInPixels
        )
        this.physics.add.collider(
            this.player,
            this.groundLayer,
            this.tileHit,
            null,
            this
        )
        this.cameras.main.startFollow(this.player)
        this.cameras.main.setZoom(5)

        this.monsters = []
        for (let i = 1; i < 4; i++) {
            this.monsters.push(new Skeleton(this, i * 100, 16, 'skeleton', 13))
        }
    }
    tileHit(player, tile) {
        if (tile.index === 99) {
            this.scene.start('World', {
                x: this.data.player.x,
                y: this.data.player.y
            })
        }
    }
    update() {
        this.player.update(this.cursors)
        this.monsters.forEach((monster) => {
            monster.update()
        })
    }
}
