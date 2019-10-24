"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var Food = (function () {
    function Food() {
        this.posy = -200;
        this.posx = Math.random() * (window.innerWidth - 300);
        this.speed = Math.random() * 5 + 1;
        this.game = Game.getInstance();
    }
    Food.prototype.update = function () {
        if (this.posy >= window.innerHeight) {
            if (this instanceof Anvil) {
                this.subject.unsubscribe(this);
            }
            this.remove();
            var index = this.game.food.indexOf(this);
            this.game.food.splice(index, 1);
        }
        else {
            this.posy += this.speed;
            this._element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px)";
        }
    };
    Object.defineProperty(Food.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Food.prototype.remove = function () {
        this._element.remove();
    };
    Food.prototype.action = function () { };
    return Food;
}());
var Anvil = (function (_super) {
    __extends(Anvil, _super);
    function Anvil(s) {
        var _this = _super.call(this) || this;
        _this.subject = s;
        s.subscribe(_this);
        _this._element = document.createElement("anvil");
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(_this._element);
        return _this;
    }
    Anvil.prototype.action = function () {
        this.game.addScore(0);
        alert("Je bent de helft van je benzine verloren!");
    };
    Anvil.prototype.notify = function () {
        this.element.remove();
        this.subject.unsubscribe(this);
        this.game.food.slice(this.game.food.indexOf(this), 1);
    };
    return Anvil;
}(Food));
var Brain = (function (_super) {
    __extends(Brain, _super);
    function Brain() {
        var _this = _super.call(this) || this;
        _this._element = document.createElement("brain");
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(_this._element);
        return _this;
    }
    Brain.prototype.action = function () {
        this.game.addScore(50);
    };
    return Brain;
}(Food));
var Character = (function () {
    function Character() {
        var _this = this;
        this.speed = 0;
        this.speedRight = 5;
        this.speedLeft = -5;
        this._htmlElement = document.createElement("div");
        document.body.appendChild(this.htmlElement).className = "character";
        this.powerup = new Powerup(this);
        this.food = Game.getInstance().food;
        this.posx = window.innerWidth / 2 - 100;
        this.posy = window.innerHeight - 150;
        this.htmlElement.style.transform = "translate(" + this.posx + "px, " + this.posy + "px)";
        this.noPowerup();
        window.addEventListener("keydown", function (e) { return _this.onKeyDown(e); });
        window.addEventListener("keyup", function (e) { return _this.onKeyUp(e); });
    }
    Character.prototype.update = function () {
        this.behaviour.update();
        this.htmlElement.style.transform = "translate(" + (this.posx += this.speed) + "px, " + this.posy + "px)";
        for (var i = 0; i < this.food.length; i++) {
            if (this.htmlElement.getBoundingClientRect().left < this.food[i].element.getBoundingClientRect().right &&
                this.htmlElement.getBoundingClientRect().right > this.food[i].element.getBoundingClientRect().left &&
                this.htmlElement.getBoundingClientRect().bottom > this.food[i].element.getBoundingClientRect().top &&
                this.htmlElement.getBoundingClientRect().top < this.food[i].element.getBoundingClientRect().bottom) {
                if (this instanceof Anvil) {
                    this.subject.unsubscribe(this);
                }
                this.food[i].action();
                this.food[i].remove();
                Game.getInstance().food.splice(i, 1);
            }
        }
        if (this.htmlElement.getBoundingClientRect().left < this.powerup.element.getBoundingClientRect().right &&
            this.htmlElement.getBoundingClientRect().right > this.powerup.element.getBoundingClientRect().left &&
            this.htmlElement.getBoundingClientRect().bottom > this.powerup.element.getBoundingClientRect().top &&
            this.htmlElement.getBoundingClientRect().top < this.powerup.element.getBoundingClientRect().bottom &&
            this.powerup.now) {
            this.powerup.action();
            Game.getInstance().powerup = true;
        }
        if (this.posx >= window.innerWidth - 120) {
            this.speedRight = 0;
        }
        if (this.posx <= 0) {
            this.speedLeft = 0;
        }
    };
    Character.prototype.noPowerup = function () {
        this.behaviour = new Walking(this);
    };
    Object.defineProperty(Character.prototype, "htmlElement", {
        get: function () {
            return this._htmlElement;
        },
        enumerable: true,
        configurable: true
    });
    Character.prototype.onKeyDown = function (event) {
        switch (event.keyCode) {
            case 37:
                this.speed = this.speedLeft;
                this._htmlElement.classList.add("characterLeft");
                this._htmlElement.classList.remove("characterRight");
                break;
            case 39:
                this.speed = this.speedRight;
                this._htmlElement.classList.add("characterRight");
                this._htmlElement.classList.remove("characterLeft");
                break;
        }
    };
    Character.prototype.onKeyUp = function (event) {
        switch (event.keyCode) {
            case 37:
                this.speed = 0;
                this._htmlElement.classList.remove("characterLeft");
                break;
            case 39:
                this.speed = 0;
                this._htmlElement.classList.remove("characterRight");
                break;
        }
    };
    return Character;
}());
var DeleteNotifier = (function () {
    function DeleteNotifier() {
        this.observers = [];
    }
    DeleteNotifier.prototype.subscribe = function (c) {
        this.observers.push(c);
    };
    DeleteNotifier.prototype.unsubscribe = function (c) {
        this.observers.splice(this.observers.indexOf(c), 1);
    };
    DeleteNotifier.prototype.update = function () {
        if (Game.getInstance().powerup) {
            for (var _i = 0, _a = this.observers; _i < _a.length; _i++) {
                var c = _a[_i];
                c.notify();
            }
            Game.getInstance().powerup = false;
        }
    };
    return DeleteNotifier;
}());
var Game = (function () {
    function Game() {
        this.score = 0;
        this.food = [];
        this.powerup = false;
        this.subject = new DeleteNotifier();
    }
    Game.prototype.initialize = function () {
        this.scoreElement = document.createElement('div');
        this.scoreElement.classList.add('score');
        document.body.appendChild(this.scoreElement);
        Start.getInstance().show();
    };
    Game.prototype.start = function () {
        this.food = this.createFood(1);
        this.character = new Character();
        this.gameLoop();
    };
    Game.getInstance = function () {
        if (!Game.instance) {
            Game.instance = new Game();
        }
        return Game.instance;
    };
    Game.prototype.addScore = function (amount) {
        if (amount === 0) {
            this.score = Math.round(this.score / 2);
            this.scoreElement.classList.remove("fullScore");
        }
        else {
            if (this.score >= 150) {
                this.score = 150;
                this.scoreElement.classList.add("fullScore");
            }
            else {
                this.scoreElement.classList.remove("fullScore");
                Math.round(this.score += amount);
            }
        }
    };
    Game.prototype.showScore = function () {
        this.scoreElement.innerHTML = "Benzine: " + this.score.toString() + "L";
    };
    Game.prototype.gameLoop = function () {
        var _this = this;
        this.character.update();
        this.subject.update();
        this.showScore();
        for (var _i = 0, _a = this.food; _i < _a.length; _i++) {
            var f = _a[_i];
            f.update();
        }
        if (this.food.length <= 2) {
            for (var _b = 0, _c = this.createFood(2); _b < _c.length; _b++) {
                var food = _c[_b];
                this.food.push(food);
            }
        }
        requestAnimationFrame(function () { return _this.gameLoop(); });
    };
    Game.prototype.createFood = function (amount) {
        var food = [];
        for (var i = 0; i < amount; i++) {
            var random = Math.floor(Math.random() * 100);
            if (random > 30) {
                food.push(new Anvil(this.subject));
            }
            else if (random > 60) {
                food.push(new Small());
            }
            else {
                food.push(new Brain());
            }
        }
        return food;
    };
    return Game;
}());
window.addEventListener("load", function () {
    var g = Game.getInstance();
    g.initialize();
});
var Powerup = (function () {
    function Powerup(character) {
        this.now = true;
        this.character = character;
        this._element = document.createElement("powerup");
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
        this.posx = 100;
        this.posy = window.innerHeight;
        this._element.style.transform = "translate(" + this.posx + "px, " + this.posy + "px)";
    }
    Powerup.prototype.action = function () {
        var _this = this;
        this.character.behaviour = new Running(this.character);
        setTimeout(function () { _this.character.noPowerup(); }, 10000);
        this.changeStatusPlant();
    };
    Object.defineProperty(Powerup.prototype, "element", {
        get: function () {
            return this._element;
        },
        enumerable: true,
        configurable: true
    });
    Powerup.prototype.changeStatusPlant = function () {
        var _this = this;
        this.now = false;
        this.element.classList.add("powerupLoading");
        setTimeout(function () { _this.element.classList.remove("powerupLoading"); _this.now = true; }, 30000);
    };
    return Powerup;
}());
var Running = (function () {
    function Running(character) {
        this.character = character;
    }
    Running.prototype.update = function () {
        this.character.speedRight = 20;
        this.character.speedLeft = -20;
    };
    return Running;
}());
var Score = (function () {
    function Score() {
        this.totalScore = 5;
        this._element = document.createElement("score");
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(this._element);
    }
    Score.prototype.update = function () {
        this._element.innerText = "Score: " + this.totalScore;
    };
    return Score;
}());
var Small = (function (_super) {
    __extends(Small, _super);
    function Small() {
        var _this = _super.call(this) || this;
        _this._element = document.createElement("small");
        var foreground = document.getElementsByTagName("foreground")[0];
        foreground.appendChild(_this._element);
        return _this;
    }
    Small.prototype.action = function () {
        this.game.addScore(5);
    };
    return Small;
}(Food));
var Start = (function () {
    function Start() {
    }
    Start.getInstance = function () {
        if (!this.instance) {
            this.instance = new Start();
        }
        return this.instance;
    };
    Start.prototype.show = function () {
        var _this = this;
        this.start = document.createElement('div');
        this.start.classList.add('start');
        this.container = document.createElement('div');
        this.container.classList.add('intro-container');
        this.start.appendChild(this.container);
        this.introText = document.createElement('span');
        this.introText.classList.add('intro-text');
        this.introText.innerText = "In deze game ga je proberen zoveel mogelijk benzine te vangen. Die dit door de pijltoetsen te gebruiken. Kijk uit dat het aanbeeld niet op je hoofd valt, dan verlies je namelijk de helft van je verzamelde benzine.";
        this.container.appendChild(this.introText);
        this.button = document.createElement('button');
        this.button.classList.add('button');
        this.button.innerText = "Start";
        this.container.appendChild(this.button);
        this.button.addEventListener("click", function () {
            _this.hide();
            Game.getInstance().start();
        }, false);
        document.body.appendChild(this.start);
    };
    Start.prototype.hide = function () {
        document.body.removeChild(this.start);
    };
    return Start;
}());
var Walking = (function () {
    function Walking(character) {
        this.character = character;
    }
    Walking.prototype.update = function () {
        this.character.speedRight = 5;
        this.character.speedLeft = -5;
    };
    return Walking;
}());
//# sourceMappingURL=main.js.map