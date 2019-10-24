# Typescript-game

## De game

Het is de bedoeling dat je de brains eet en de cherries ontwijkt. Je kunt een powerup links onderin pakken waardoor je sneller gaat bewegen en die ervoor zorgt dat er cherries verwijderd worden.

## Speelbare link

(https://carinhansen.github.io/typescript-game/)

### Peer review/ pull request

Ik heb een class gemaakt voor de 'file' object in de creator class omdat je nu gemakkelijk extra dingen kan toevoegen in de toekomst. Ik denk ook dat het er nu meer professioneel uit ziet
pull request: (https://github.com/perrydrums/prg-8/pull/1)

### Peer review 2

Voor de tweede peer review heb ik de code van Arno de Jong gereviewd
(https://github.com/arnojong/prg08/issues/3)

## Installatie guide

* Clone of fork de repository
* Ga naar de 'docs' map
* Sleep index.html in een tabblad in je browser
* Done!

## Klassendiagram

![](docs/images/uml.png)

## Singleton

Om te zorgen dat er niet meerdere instanties aangemaakt kunnen worden van Game heb ik gebruik gemaakt van een singleton.

```typescript
public static getInstance() {
    if (! Game.instance) {
        Game.instance = new Game();
    }
    return Game.instance;
}
```

Het startscherm is ook een singleton omdat er maar één instantie van een startscherm nodig is.

```typescript
public static getInstance() {
    if (!this.instance) {
        this.instance = new Start()
        
    }
    return this.instance
}
```

## Polymorfisme

Ik heb polymorfisme toegepast in de class Game. Ik maak een array aan waar food in gaat. Het wordt gevuld met verschillende soorten food. Het wordt namelijk gevuld met Brains en Cherries. 

```typescript
this.food = this.createFood(6);
```

```typescript
private createFood(amount:number):Food[] {
    let food:Food[] = [];
    const random = Math.floor(Math.random() * 100);
    for (let i = 0; i < amount; i ++) {
        if (random > 30) {
            food.push(new anvil(this.subject));
        }
        else {
            food.push(new Brain());
        }
    }
    return food;
}
```

door f.update() worden alle soorten food aangesproken. Brains en Cherries worden geupdate.
```typescript
for(let f of this.food){
    f.update()
}

if(this.food.length <= 4 ){
    for (let food of this.createFood(2)) {
        this.food.push(food)
    }
}
````


## Strategy

Ik heb voor de character twee behaviours gemaakt. De character 'loopt' in eerste instantie. De speed is daar langzaam. Als de character de powerup pakt bij het plantje links onderin gaat hij 'rennen'. De speed gaat hierbij omhoog. 

```typescript
this.character.behaviour = new Running(this.character);
```

Ik heb hiervoor een interface gemaakt Movement. De class Walking implements Movement en de class Running ook. Walking en Running zijn de twee behaviours.


## Observer


De class DeleteNotifier is het subject. anvil is de observer. De anvil 'beluisterd' of de powerup opgepakt wordt. Als de powerup gepakt wordt worden er cherries verwijderd. De slice functie scant de food array  op instanties van cherries.

