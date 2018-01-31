import { Component } from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    game: Phaser.Game;
    map: any;
    layer: any;
    cursors: any;
    perso: Phaser.Sprite;
    scale: number;

    constructor() {
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }
    preload() {
        this.game.load.tilemap('mario', 'assets/map/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/map/super_mario.png', 16, 16);
        this.game.load.spritesheet('link', 'assets/map/link.png', 102, 110, 80);
        this.scale = (4 / 949) * window.innerHeight;
    }
    create() {
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.map = this.game.add.tilemap('mario');
        this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
        this.layer = this.map.createLayer('World1', window.screen.width, window.screen.height);
        this.layer.scale.set(this.scale);
        this.layer.resizeWorld();
        this.layer.wrap = true;
        this.cursors = this.game.input.keyboard.createCursorKeys();

        this.perso = this.game.add.sprite(16 * 16 * this.scale, 12 * 16 * this.scale, 'link');
        this.game.physics.enable(this.perso);
        this.perso.body.bounce.y = 0.2;
        this.perso.body.gravity.y = 0;
        this.perso.body.collideWorldBounds = true;
        this.perso.anchor.x = 0.5;
        this.perso.anchor.y = 0.5;
    }
    update() {
        
            if (this.cursors.left.isDown)
            {
                this.game.camera.x -= 4;
            }
            else if (this.cursors.right.isDown)
            {
                this.game.camera.x += 4;
            }
        
        }
}
