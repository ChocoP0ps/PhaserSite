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
    bending = false;
    jump = true;

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
        this.game.load.spritesheet('perso', 'assets/map/perso_grand.png', 698, 640);
        this.scale = (1 / 949) * window.innerHeight;
        this.speed = 300;
    }
    create() {
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('SuperMarioBros-World1-1', 'tiles');
        this.layer = this.map.createLayer('World1', window.screen.width, window.screen.height);
        this.layer.scale.set(this.scale);
        this.layer.resizeWorld();
        this.layer.wrap = true;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.map.setCollision([14, 16, 21, 22, 27, 28, 40]);
        this.game.physics.arcade.gravity.y = 400;

        this.perso = this.game.add.sprite(64 * 16 * this.scale, 64 * 12 * this.scale, 'perso');
        this.perso.scale.set(0.2);
        this.game.physics.enable(this.perso);
        this.perso.body.collideWorldBounds = true;
        this.perso.anchor.x = 0.5;
        this.perso.anchor.y = 0.5;
        this.perso.animations.add('idle', [4, 15, 26], 6, true, true);
        this.perso.animations.add('walk_horizontally', [8, 19, 30, 41, 52, 63, 74, 85], 30, true, true);
        this.perso.animations.add('jump', [6, 17, 28], 10, true, true);
        this.perso.animations.add('bend', [2, 13, 24, 3], 10, true, true);
        this.game.physics.enable(this.perso);
        this.perso.body.setSize(322, 555, 160, 85);
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
        this.bending = false;
        // this.perso.body.velocity.y = 0;

        this.jump = !this.perso.body.onFloor();
        
        if (this.up && this.perso.body.onFloor()) {
            this.jump = true;
            this.perso.body.velocity.y = -350;
            if (this.perso.animations.name !== 'jump') {
                this.perso.animations.play('jump', 30, false);
            }
        } else if (this.down) {
            this.bending = true;
            this.perso.body.velocity.y = this.speed;
            if (this.perso.animations.name !== 'bend') {
                this.perso.animations.play('bend', 30, false);
            }
        } 

        if (this.left && !this.bending) {
            this.perso.body.velocity.x = this.speed * (-1);
            if (this.perso.scale.x > 0) {
                this.perso.scale.x *= -1;
            }
            if (!this.jump && this.perso.animations.name !== 'walk_horizontally') {
                this.perso.animations.play('walk_horizontally', 30, true);
            }
        } else if (this.right && !this.bending) {
            this.perso.body.velocity.x = this.speed;
            if (this.perso.scale.x < 0) {
                this.perso.scale.x *= -1;
            }
            if (!this.jump && this.perso.animations.name !== 'walk_horizontally') {
                this.perso.animations.play('walk_horizontally', 30, true);
            }
        }
        if (!this.left && !this.right && !this.jump && !this.bending) {
            if (this.perso.animations.name !== 'idle') {
                this.perso.animations.play('idle', 6, true);
            }
        }
    }
}
