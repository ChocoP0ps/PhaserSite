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
    speed: number;
    up = false;
    down = false;
    right = false;
    left = false;

    constructor() {
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update
        });
    }
    preload() {
        this.game.load.tilemap('map', 'assets/map/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/map/super_mario.png', 64, 64);
        this.game.load.spritesheet('perso', 'assets/map/sprite.png', 64, 64);
        this.scale = (1 / 949) * window.innerHeight;
        this.speed = 300;
    }
    create() {
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
        this.layer = this.map.createLayer('World1', window.screen.width, window.screen.height);
        this.layer.scale.set(this.scale);
        this.layer.resizeWorld();
        this.layer.wrap = true;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.map.setCollision([14, 16, 21, 22, 27, 28, 40]);

        this.perso = this.game.add.sprite(64 * 16 * this.scale, 64 * 12 * this.scale, 'perso');
        this.perso.scale.set(this.scale * 2);
        this.game.physics.enable(this.perso);
        this.perso.body.bounce.y = 0.2;
        this.perso.body.gravity.y = 7000;
        this.perso.body.collideWorldBounds = true;
        this.perso.anchor.x = 0.5;
        this.perso.anchor.y = 0.5;
        this.perso.animations.add('walk_left', [118, 119, 120, 121, 122, 123, 124, 125], 10, true, true);
        this.perso.animations.add('walk_right', [144, 145, 146, 147, 148, 149, 150, 151], 10, true, true);
        this.perso.animations.add('walk_up', [260, 261, 262, 263, 264, 265], 10, true, true);
        this.perso.frame = 26;
        this.game.physics.enable(this.perso);
    }

    update() {

        this.game.physics.arcade.collide(this.perso, this.layer);

        this.game.camera.x = this.perso.position.x - (window.innerWidth / 2);

        if (this.cursors.left.isDown) {
            this.left = true;
            this.right = false;
        } else if (this.cursors.right.isDown) {
            this.left = false;
            this.right = true;
        } else {
            this.left = false;
            this.right = false;
        }

        if (this.cursors.up.isDown) {
            this.up = true;
            this.down = false;
        } else if (this.cursors.down.isDown) {
            this.up = false;
            this.down = true;
        } else {
            this.up = false;
            this.down = false;
        }

        this.perso.body.velocity.x = 0;
        this.perso.body.velocity.y = 0;

        if (this.left) {
            this.perso.body.velocity.x = this.speed * (-1);
            if (this.perso.animations.name !== 'walk_left' || this.perso.animations.paused) {
                this.perso.animations.play('walk_left', 10, true);
                this.perso.animations.paused = false;
            }
        } else if (this.right) {
            this.perso.body.velocity.x = this.speed;
            if (this.perso.animations.name !== 'walk_right' || this.perso.animations.paused) {
                this.perso.animations.play('walk_right', 10, true);
                this.perso.animations.paused = false;
            }
        } else if (this.up) {
            this.perso.body.velocity.y = this.speed * (-1);
            if (this.perso.animations.name !== 'walk_up' || this.perso.animations.paused) {
                this.perso.animations.play('walk_up', 10, true);
                this.perso.animations.paused = false;
            }
            if (this.perso.scale.x < 0) {
                this.perso.scale.x *= -1;
            }
        } else if (this.down) {

        } else {
            this.perso.animations.paused = true;
            this.perso.frame = 26;
        }
    }
}
