import { Component } from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

export class MetroidLevel {
    game: Phaser.Game;
    level: any;
    map: any;
    backLayer: any;
    decoLayer: any;
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

    doors_down: any;
    doors_up: any;

    constructor(game) {
        this.game = game;
        this.level = {
            preload: this.preload,
            create: this.create,
            update: this.update,
            render: this.render
        };
    }

    getLevel() {
        return this.level;
    }

    preload() {
        // this.game.scale.setGameSize(50 * 64, 84 * 64);
        this.game.load.tilemap('map', 'assets/map/metroid.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('extras', 'assets/map/extras.png', 64, 64);
        this.game.load.image('main', 'assets/map/main_blue.png', 64, 64);
        this.game.load.image('doors_left', 'assets/map/regular_left.png');
        this.game.load.image('doors_right', 'assets/map/regular_right.png');
        this.game.load.spritesheet('perso', 'assets/map/perso_grand.png', 349, 320);
        this.scale = window.innerHeight / 949;
        this.speed = 800;
    }
    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('main', 'main');
        this.map.addTilesetImage('extras', 'extras');
        this.backLayer = this.map.createLayer('Tile Layer 1', 50 * 64, 84 * 64);
        this.backLayer.scale.set(this.scale);
        this.backLayer.resizeWorld();
        // this.backLayer.wrap = true;
        this.decoLayer = this.map.createLayer('Decorations', 50 * 64, 84 * 64);
        this.decoLayer.scale.set(this.scale);
        this.decoLayer.resizeWorld();
        // this.decoLayer.wrap = true;
        this.game.scale.scaleMode = Phaser.ScaleManager.EXACT_FIT;
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.map.setCollisionByExclusion([12, 13 , 14, 15, 21, 22, 49, 50, 51, 52, 65, 66, 83, 84, 85, 86], true, this.backLayer);
        this.backLayer.debug = true;
        this.game.physics.arcade.gravity.y = 400;

        this.doors_down = this.game.add.sprite(0 , 64 * 73 * this.scale, 'doors_left');

        this.perso = this.game.add.sprite(64 * 5 * this.scale, 64 * 78 * this.scale, 'perso');
        this.perso.scale.set(0.8);
        this.game.physics.enable(this.perso);
        this.perso.body.collideWorldBounds = false;
        this.perso.body.bounce = 0;
        this.perso.body.gravity = 400;
        this.perso.anchor.x = 0.5;
        this.perso.anchor.y = 0.5;
        this.perso.animations.add('idle', [4, 15, 26], 6, true, true);
        this.perso.animations.add('walk_horizontally', [8, 19, 30, 41, 52, 63, 74, 85], 30, true, true);
        this.perso.animations.add('jump', [6, 17, 28], 10, true, true);
        this.perso.animations.add('bend', [2, 13, 24, 3], 10, true, true);
        this.game.physics.enable(this.perso);
        this.perso.body.setSize(161, 278, 80, 43);
        this.game.camera.follow(this.perso);
    }

    render() {
            this.game.debug.body(this.perso);
            this.game.debug.body(this.backLayer);
    }

    update() {


        this.game.physics.arcade.collide(this.perso, this.backLayer);

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
            this.perso.body.velocity.y = -1000;
            if (this.perso.animations.name !== 'jump') {
                this.perso.animations.play('jump', 6, true);
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
