///<reference path='food.ts' />
class Brain extends Food {

    constructor(){
        super();
        this._element = document.createElement("brain")
        let foreground = document.getElementsByTagName("foreground")[0]
        foreground.appendChild(this._element);
    }

    public action(){
        this.game.addScore(50);
    }
}