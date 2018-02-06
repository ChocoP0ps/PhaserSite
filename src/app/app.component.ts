import { Component } from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import { MarioLevel } from './marioLevel';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    game: Phaser.Game;
    marioLevel: MarioLevel;
    zeldaLevel: any;

    constructor() {
        this.game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.AUTO, 'content');
        
        this.marioLevel = new MarioLevel(this.game);

        this.game.state.add('mario', this.marioLevel);
        this.game.state.add('zelda', this.marioLevel);

        this.game.state.start('mario');
    }
}
