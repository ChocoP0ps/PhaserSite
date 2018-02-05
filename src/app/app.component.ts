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
    descr: string;
    nextLetter: number;
    counterLetter: number;
    descrText: any;
    formationTile: any;
    experienceTile: any;
    projetsTile: any;
    contactTile: any;
    formationText: any;
    nextLetterFormation: number;
    experienceText: any;
    nextLetterExperience: number;
    projetsText: any;
    nextLetterProjet: number;
    contactText: any;
    nextLetterContact: number;

    constructor() {
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content', {
            preload: this.preload,
            create: this.create,
            update: this.update,
            formationCallback: this.formationCallback
        });
    }
    preload() {
        this.game.load.tilemap('map', 'assets/map/super_mario.json', null, Phaser.Tilemap.TILED_JSON);
        this.game.load.image('tiles', 'assets/map/super_mario.png', 64, 64);
        this.game.load.spritesheet('perso', 'assets/map/perso_grand.png', 698, 640);
        this.scale = (1 / 949) * window.innerHeight;
        this.speed = 300;
        this.game.load.bitmapFont('emulogic_white', 'assets/Fonts/emulogic_white.png', 'assets/Fonts/emulogic.fnt', 0, 0, 10);
        this.game.load.bitmapFont('emulogic_black', 'assets/Fonts/emulogic_black.png', 'assets/Fonts/emulogic.fnt', 0, 0, 10);
        this.nextLetter = 0;
        this.nextLetterFormation = 0;
        this.nextLetterExperience = 0;
        this.nextLetterProjet = 0;
        this.nextLetterContact = 0;
        this.counterLetter = 0;
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

        this.descr = "Je m'appelle Alexandre Cano.\nJe suis etudiant en troisieme annee d'ecole\nd'ingenieur informatique, a l'eXia.Cesi\nd'Aix en Provence, ou je prepare un diplome de\ngenie logiciel.\nJe suis a la recherche d'un stage dans mon\ndomaine de predilection, le jeux video.\nJe vous laisse partir a l'aventure, a travers\nce personnage, afin de decouvrir mon univers.";
        this.descrText = this.game.add.bitmapText(11 * 64, 3 * 64, 'emulogic_white', '', 16);

        this.formationText = this.game.add.bitmapText(11.73 * 64, 8.6 * 64, 'emulogic_black', '', 11);
        this.experienceText = this.game.add.bitmapText(14.6 * 64, 8.6 * 64, 'emulogic_black', '', 11);
        this.projetsText = this.game.add.bitmapText(17.87 * 64, 8.6 * 64, 'emulogic_black', '', 11);
        this.contactText = this.game.add.bitmapText(20.87 * 64, 8.6 * 64, 'emulogic_black', '', 11);

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

        this.formationTile = this.layer.getTiles(12 * 64, 9 * 64, 64, 64)[0];
        this.experienceTile = this.layer.getTiles(15 * 64, 9 * 64, 1, 1)[0];
        this.projetsTile = this.layer.getTiles(18 * 64, 9 * 64, 1, 1)[0];
        this.contactTile = this.layer.getTiles(21 * 64, 9 * 64, 1, 1)[0];

    }

    formationCallback(sprite, tile) {
        console.log('hit formation');
    }

    update() {

        if (this.nextLetter < this.game.time.now && this.counterLetter < this.descr.length) {
            this.descrText.text += this.descr[this.counterLetter];
            this.counterLetter++;
            this.nextLetter = this.game.time.now + 50;
        }

        if (this.perso.position.x > 11.5 * 64 && this.perso.position.x < 13.5 * 64) {
            if (this.nextLetterFormation < this.game.time.now && this.formationText.text.length < 'Formation'.length) {
                this.formationText.text += 'Formation'[this.formationText.text.length];
                this.nextLetterFormation = this.game.time.now + 50;
            }
            if (this.perso.position.x > 12 * 64 && this.perso.position.x < 13 * 64 && this.perso.position.y < 690 && this.perso.position.y > 685) {
                console.log(this.perso.position.y);
            }
        } else {
            this.formationText.text = this.formationText.text.substring(0, this.formationText.text.length - 1);
        }
        if (this.perso.position.x > 14.5 * 64 && this.perso.position.x < 16.5 * 64) {
            if (this.nextLetterExperience < this.game.time.now && this.experienceText.text.length < 'Experience'.length) {
                this.experienceText.text += 'Experience'[this.experienceText.text.length];
                this.nextLetterExperience = this.game.time.now + 50;
            }
            if (this.perso.position.x > 15 * 64 && this.perso.position.x < 16 * 64 && this.perso.position.y < 690 && this.perso.position.y > 685) {
                console.log(this.perso.position.y);
            }
        } else {
            this.experienceText.text = this.experienceText.text.substring(0, this.experienceText.text.length - 1);
        }
        if (this.perso.position.x > 17.5 * 64 && this.perso.position.x < 19.5 * 64) {
            if (this.nextLetterProjet < this.game.time.now && this.projetsText.text.length < 'Projets'.length) {
                this.projetsText.text += 'Projets'[this.projetsText.text.length];
                this.nextLetterProjet = this.game.time.now + 50;
            }
            if (this.perso.position.x > 18 * 64 && this.perso.position.x < 19 * 64 && this.perso.position.y < 690 && this.perso.position.y > 685) {
                console.log(this.perso.position.y);
            }
        } else {
            this.projetsText.text = this.projetsText.text.substring(0, this.projetsText.text.length - 1);
        }
        if (this.perso.position.x > 20.5 * 64 && this.perso.position.x < 22.5 * 64) {
            if (this.nextLetterContact < this.game.time.now && this.contactText.text.length < 'Contact'.length) {
                this.contactText.text += 'Contact'[this.contactText.text.length];
                this.nextLetterContact = this.game.time.now + 50;
            }
            if (this.perso.position.x > 21 * 64 && this.perso.position.x < 22 * 64 && this.perso.position.y < 690 && this.perso.position.y > 685) {
                console.log(this.perso.position.y);
            }
        } else {
            this.contactText.text = this.contactText.text.substring(0, this.contactText.text.length - 1);
        }

        if (this.formationTile.containsPoint(this.game.input.x, this.game.input.y)) {
            console.log('on formation');
        } else if (this.experienceTile.containsPoint(this.game.input.x, this.game.input.y)) {
            console.log('on experience');
        } else if (this.projetsTile.containsPoint(this.game.input.x, this.game.input.y)) {
            console.log('on projets');
        } else if (this.contactTile.containsPoint(this.game.input.x, this.game.input.y)) {
            console.log('on contact');
        }


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
