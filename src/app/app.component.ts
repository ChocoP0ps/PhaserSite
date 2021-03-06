import { Component } from '@angular/core';
import 'phaser-ce/build/custom/pixi';
import 'phaser-ce/build/custom/p2';
import * as Phaser from 'phaser-ce/build/custom/phaser-split';
import { MarioLevel } from './marioLevel';
import { MetroidLevel } from './metroidLevel';
import { DonkeyKongLevel } from './donkeyKongLevel';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {
    game: Phaser.Game;
    marioLevel: any;
    metroidLevel: any;
    donkeyKongLevel: any;

    constructor() {
        this.game = new Phaser.Game('100', '100', Phaser.Canvas, 'content');

        const mario = new MarioLevel(this.game);
        this.marioLevel = mario.getLevel();
        const metroid = new MetroidLevel(this.game);
        this.metroidLevel = metroid.getLevel();
        const donkeyKong = new DonkeyKongLevel(this.game);
        this.donkeyKongLevel = donkeyKong.getLevel();

        this.game.state.add('mario', this.marioLevel);
        this.game.state.add('metroid', this.metroidLevel);
        this.game.state.add('donkeyKong', this.donkeyKongLevel);

        this.game.state.start('mario');
    }
}
