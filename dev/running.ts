class Running implements Movement {
    private character:Character

    constructor(character:Character){
       this.character = character
    }

    public update(){
        this.character.speedRight = 20
        this.character.speedLeft = -20
    }
}