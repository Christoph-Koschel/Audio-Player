"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animation = void 0;
var Animation = (function () {
    function Animation(canvas, player) {
        this.canvas = canvas;
        this.player = player;
        this.loop = false;
        this.ctx = this.canvas.getContext("2d");
    }
    Animation.prototype.start = function () {
        this.loop = true;
        this.draw();
    };
    Animation.prototype.stop = function () {
        this.loop = false;
    };
    Animation.prototype.draw = function () {
        this.canvas.height = window.innerHeight - 90;
        this.canvas.width = window.innerWidth - 200;
        var centerX = this.canvas.width / 2;
        var centerY = this.canvas.height / 2;
        window.requestAnimationFrame(this.draw);
    };
    return Animation;
}());
exports.Animation = Animation;
//# sourceMappingURL=animation.js.map