import World from './world.js'
import Scroller from './scroller.js'
import UIScene from './uiScene.js'
new Phaser.Game({
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }
            //debug: true
        }
    },
    fps: {
        target: 60,
        forceSetTimeOut: true
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
    },
    scene: [World, Scroller, UIScene]
})
