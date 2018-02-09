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
    shooting = false;
    doors_down: any;
    doors_up: any;
    bulletTime: number;
    bullet: any;
    bullets: any;
    enemies: any;
    moveEnemiesTime: number;
    skillsLang: string[];
    skillsComm: string[];

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
        // this.game.scale.setGameSize(50 * 64, 84 * 64);
        this.game.load.tilemap('map', 'assets/map/metroid.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('extras', 'assets/map/extras.png', 64, 64);
        this.game.load.image('main', 'assets/map/main_blue.png', 64, 64);
        this.game.load.image('doors_left', 'assets/map/regular_left.png');
        this.game.load.image('doors_right', 'assets/map/regular_right.png');
        this.game.load.image('bullet', 'assets/map/bullet.png');
        this.game.load.image('mantanoid', 'assets/map/mantanoid.png');
        this.game.load.image('bat', 'assets/map/bat.png');
        this.game.load.spritesheet('perso', 'assets/map/perso_grand.png', 349, 320);
        this.scale = window.innerHeight / 949;
        this.speed = 800;
        this.bulletTime = 0;
        this.moveEnemiesTime = 0;
        this.skillsLang = ['Java', 'C#', 'C++', 'JavaScript', 'PHP', 'SQL', 'Python', 'C'];
        this.skillsComm = ['Teamwork', 'Passionate', 'Leader'];
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
        this.map.setCollisionByExclusion([12, 13, 14, 15, 21, 22, 49, 50, 51, 52, 65, 66, 83, 84, 85, 86], true, this.backLayer);
        this.game.physics.arcade.gravity.y = 1000;

        this.doors_down = this.game.add.sprite(0, 64 * 73 * this.scale, 'doors_left');
        this.game.physics.enable(this.doors_down);
        this.doors_down.body.immovable = true;
        this.doors_down.body.allowGravity = false;
        this.doors_up = this.game.add.sprite(64 * 49 * this.scale, 64 * 4 * this.scale, 'doors_right');
        this.game.physics.enable(this.doors_up);
        this.doors_up.body.immovable = true;
        this.doors_up.body.allowGravity = false;

        this.bullets = this.game.add.group();
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;
        this.bullets.createMultiple(100, 'bullet');
        this.bullets.callAll('events.onOutOfBounds.add', 'events.onOutOfBounds', () => {
            this.bullet.kill();
        }, this);
        this.bullets.setAll('checkWorldBounds', true);
        this.bullets.enableBody = true;
        this.bullets.physicsBodyType = Phaser.Physics.ARCADE;

        this.enemies = this.game.add.group();
        this.enemies.create(41 * 64, 74 * 64, 'mantanoid');
        this.enemies.create(19 * 64, 74 * 64, 'mantanoid');
        this.enemies.create(30 * 64, 66 * 64, 'mantanoid');
        this.enemies.create(33 * 64, 42 * 64, 'mantanoid');
        this.enemies.create(40 * 64, 42 * 64, 'mantanoid');
        this.enemies.create(31 * 64, 24 * 64, 'mantanoid');
        this.enemies.create(30 * 64, 12 * 64, 'mantanoid');
        this.enemies.create(7 * 64, 12 * 64, 'mantanoid');
        this.enemies.create(43 * 64, 64 * 64, 'bat');
        this.enemies.create(13 * 64, 45 * 64, 'bat');
        this.enemies.create(42 * 64, 23 * 64, 'bat');
        this.game.physics.enable(this.enemies);
        this.enemies.setAll('body.allowGravity', false);
        this.enemies.setAll('anchor.x', 0.5);
        var style = { font: "30px Arial", fill: "#ffffff" };

        let indexManta = 0;
        let indexBat = 0;
        for (var i = 0; i < this.enemies.children.length; i++) {
            if (this.enemies.children[i].key === 'mantanoid') {
                this.enemies.children[i].addChild(this.game.add.text(25, 0, this.skillsLang[indexManta], style));
                indexManta++;
            } else if (this.enemies.children[i].key === 'bat') {
                this.enemies.children[i].addChild(this.game.add.text(20, 20, this.skillsComm[indexBat], style));
                indexBat++;
            }
        }

        this.perso = this.game.add.sprite(64 * 5 * this.scale, 64 * 78 * this.scale, 'perso');
        this.perso.scale.set(0.8);
        this.game.physics.enable(this.perso);
        this.perso.body.collideWorldBounds = true;
        this.perso.anchor.x = 0.5;
        this.perso.anchor.y = 0.5;
        this.perso.animations.add('idle', [43, 54, 65, 76], 6, true, true);
        this.perso.animations.add('walk_horizontally', [9, 20, 31, 42, 53, 64, 75, 86, 97, 108], 30, true, true);
        this.perso.animations.add('shoot', [10, 21, 32, 43, 54, 65, 76], 30, true, true);
        this.perso.animations.add('jump', [6, 17, 28], 10, true, true);
        this.perso.animations.add('bend', [2, 13, 24, 3], 10, true, true);
        this.perso.animations.add('roll', [7, 18, 29, 40, 51, 62, 73], 10, true, true);
        this.game.physics.enable(this.perso);
        this.perso.body.setSize(161, 278, 80, 43);
        this.game.camera.follow(this.perso);
    }

    update() {
        this.game.physics.arcade.collide(this.perso, this.backLayer);
        this.game.physics.arcade.collide(this.enemies, this.backLayer);
        this.game.physics.arcade.collide(this.perso, this.doors_down, () => {
            this.game.state.start('mario');
        });
        this.game.physics.arcade.collide(this.perso, this.doors_up, () => {
            this.game.state.start('mario');
        });
        this.game.physics.arcade.collide(this.perso, this.enemies, () => {
            this.game.state.start('metroid');
        });
        this.game.physics.arcade.collide(this.bullets, this.enemies, (bullet, enemy) => {
            bullet.kill();
            enemy.kill();
        });

        if (this.moveEnemiesTime < this.game.time.now) {
            this.moveEnemiesTime = this.game.time.now + 500;
            for (var i = 0; i < this.enemies.children.length; i++) {
                if (this.enemies.children[i].key === 'mantanoid') {
                    this.enemies.children[i].body.velocity.x = (Math.random() - 0.5) * 500;
                } else if (this.enemies.children[i].key === 'bat') {
                    this.enemies.children[i].body.velocity.x = (Math.random() - 0.5) * 500;
                    this.enemies.children[i].body.velocity.y = (Math.random() - 0.5) * 500;
                }
                if (this.enemies.children[i].body.velocity.x > 0 && this.enemies.children[i].scale.x < 0 ||
                    this.enemies.children[i].body.velocity.x < 0 && this.enemies.children[i].scale.x > 0) {
                    this.enemies.children[i].scale.x *= -1;
                    this.enemies.children[i].children[0].scale.x *= -1;
                }
            }
        }

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


        if (this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR).isDown) {
            this.shooting = true;
            if (this.game.time.now > this.bulletTime) {
                this.bullet = this.bullets.getFirstExists(false);

                if (this.bullet) {
                    this.bullet.reset(this.perso.x + 6, this.perso.y + 18);
                    this.bullet.scale.set(0.1);
                    this.bullet.body.allowGravity = false;
                    if (this.perso.scale.x < 0) {
                        this.bullet.body.velocity.x = -1000;
                    } else {
                        this.bullet.body.velocity.x = 1000;
                    }
                    this.bulletTime = this.game.time.now + 250;
                }
            }
            if (this.perso.animations.name !== 'shoot') {
                this.perso.animations.play('shoot', 20, true);
            }
        } else {
            this.shooting = false;
        }

        if (this.up && this.perso.body.onFloor()) {
            this.jump = true;
            this.perso.body.velocity.y = -1200;
            if (this.perso.animations.name !== 'roll') {
                this.perso.animations.play('roll', 20, true);
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
            this.perso.frame = 54;
            // if (this.perso.animations.name !== 'idle') {
            //     this.perso.animations.play('idle', 6, true);
            // }
        }
    }
}
