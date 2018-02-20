import { Component } from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';

export class DonkeyKongLevel {
    game: Phaser.Game;
    level: any;
    map: any;
    groundLayer: any;
    ladderLayer: any;
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
    shooting = false;
    tps: any;
    bulletTime: number;
    bullet: any;
    bullets: any;
    enemies: any;
    moveEnemiesTime: number;
    skillsLang: string[];
    skillsComm: string[];
    nbKilled: number;

    constructor(game) {
        this.game = game;
        this.level = {
            preload: this.preload,
            create: this.create,
            update: this.update
        };
    }

    getLevel() {
        return this.level;
    }

    preload() {
        this.game.load.tilemap('map', 'assets/map/donkey_kong.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('ground', 'assets/map/ground.png', 64, 8);
        this.game.load.image('ladder', 'assets/map/ladder.png', 64, 8);
        this.game.load.image('tp', 'assets/map/tp.png', 64, 64);
        this.game.load.spritesheet('perso', 'assets/map/perso_grand.png', 349, 320);
        this.scale = window.innerWidth / 1792 < 1 ? 1 : window.innerWidth / 1792;
        this.speed = 800;
    }
    create() {
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
        this.map = this.game.add.tilemap('map');
        this.map.addTilesetImage('ground', 'ground');
        this.map.addTilesetImage('ladder', 'ladder');
        this.groundLayer = this.map.createLayer('Ground', 28 * 64, 260 * 8);
        this.groundLayer.setScale(this.scale, this.scale);
        // this.groundLayer.wrap = true;
        this.groundLayer.resizeWorld();
        this.ladderLayer = this.map.createLayer('Ladder', 28 * 64, 260 * 8);
        this.ladderLayer.setScale(this.scale, this.scale);
        // this.ladderLayer.wrap = true;
        this.ladderLayer.resizeWorld();
        this.map.setCollisionByExclusion([], true, this.groundLayer);
        this.cursors = this.game.input.keyboard.createCursorKeys();
        this.game.physics.arcade.gravity.y = 1000;

        this.tps = this.game.add.group();

        this.tps.create(4 * 64 * this.scale, 3 * 8 * this.scale, 'tp');
        this.tps.create(7 * 64 * this.scale, 3 * 8 * this.scale, 'tp');
        this.tps.children.forEach(tp => {
            this.game.physics.enable(tp);
            tp.body.immovable = true;
            tp.body.allowGravity = false;
        });

        this.perso = this.game.add.sprite(64 * 2 * this.scale, 8 * 236 * this.scale, 'perso');
        this.perso.scale.set(0.5 * this.scale);
        this.game.physics.enable(this.perso);
        this.perso.body.collideWorldBounds = true;
        this.perso.anchor.x = 0.5;
        this.perso.anchor.y = 0.5;
        this.perso.animations.add('idle', [4, 15, 26], 6, true, true);
        this.perso.animations.add('shoot', [10, 21, 32, 43, 54, 65, 76], 30, true, true);
        this.perso.animations.add('walk_horizontally', [8, 19, 30, 41, 52, 63, 74, 85], 30, true, true);
        this.perso.animations.add('jump', [6, 17, 28], 10, true, true);
        this.perso.animations.add('bend', [2, 13, 24, 3], 10, true, true);
        this.perso.animations.add('roll', [7, 18, 29, 40, 51, 62, 73], 10, true, true);
        this.game.physics.enable(this.perso);
        this.perso.body.setSize(161, 278, 80, 43);
        this.game.camera.follow(this.perso);
    }

    update() {
        this.game.physics.arcade.collide(this.perso, this.groundLayer);
        this.game.physics.arcade.collide(this.perso, this.tps, () => {
            this.game.state.start('mario');
        });

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
        this.shooting = false;
        // this.perso.body.velocity.y = 0;

        this.jump = !this.perso.body.onFloor();

        if (this.perso.body.velocity.y > 1000) {
            this.perso.body.velocity.y = 1000;
        }

        if (this.up && this.perso.body.onFloor()) {
            this.jump = true;
            this.perso.body.velocity.y = -750;
            if (this.perso.animations.name !== 'jump') {
                this.perso.animations.play('jump', 20, true);
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
        if (!this.left && !this.right && !this.jump && !this.bending && !this.shooting) {
            // this.perso.frame = 54;
            if (this.perso.animations.name !== 'idle') {
                this.perso.animations.play('idle', 6, true);
            }
        }
    }
}
