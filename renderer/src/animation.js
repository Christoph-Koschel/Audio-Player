"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Animation = void 0;
var Animation = (function () {
    function Animation(id, player) {
        this.elementID = id;
        this.canvas = document.getElementById(id);
        this.player = player;
        this.loop = false;
        this.sizer = 1.5;
    }
    Animation.prototype.start = function () {
        this.loop = true;
        this.draw();
    };
    Animation.prototype.stop = function () {
        this.loop = false;
        this.clear();
    };
    Animation.prototype.updateSize = function (openSiteMenu) {
        this.canvas.height = window.innerHeight - 180;
        if (openSiteMenu) {
            this.canvas.width = window.innerWidth - 240;
        }
        else {
            this.canvas.width = window.innerWidth - 40;
        }
    };
    Animation.prototype.clear = function () {
        var ctx = this.canvas.getContext("2d");
        var centerX = this.canvas.width / 2;
        var centerY = this.canvas.height / 2;
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        this.outerCircle(ctx, centerX, centerY);
        this.innerCircle(ctx, centerX, centerY);
    };
    Animation.prototype.outerCircle = function (ctx, centerX, centerY) {
        var gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100 + 10 + 255 / this.sizer);
        gradient.addColorStop(1, "rgba(0,0,0)");
        gradient.addColorStop(0.1, "#ffffff");
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.rect(0, 0, this.canvas.width, this.canvas.height);
        ctx.fill();
    };
    Animation.prototype.innerCircle = function (ctx, centerX, centerY) {
        var gradient = ctx.createRadialGradient(centerX, centerY, 0, centerX, centerY, 100 - 5);
        gradient.addColorStop(1, "rgba(163,0,252,0.5)");
        gradient.addColorStop(0.5, "#ffffff");
        ctx.beginPath();
        ctx.fillStyle = gradient;
        ctx.arc(centerX, centerY, 100 - 5, 0, Math.PI * 2);
        ctx.fill();
    };
    Animation.prototype.bars = function (ctx, centerX, centerY) {
        var frequency_array = this.player.getFrequency();
        var alpha = 0;
        var x1;
        var x2;
        var y1;
        var y2;
        for (var i = 0; i < 360; i++) {
            x1 = Math.cos(alpha) * 100;
            x2 = Math.cos(alpha) * (100 + frequency_array[i] / this.sizer);
            y1 = Math.sin(alpha) * 100;
            y2 = Math.sin(alpha) * (100 + frequency_array[i] / this.sizer);
            x1 += centerX;
            x2 += centerX;
            y1 += centerY;
            y2 += centerY;
            ctx.beginPath();
            var gradient = ctx.createLinearGradient(x1, y1, x2, y2);
            gradient.addColorStop(0.1, "rgba(163,0,252,0.5)");
            gradient.addColorStop(1, "#ffffff");
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 4;
            ctx.moveTo(x1, y1);
            ctx.lineTo(x2, y2);
            ctx.stroke();
            alpha = alpha + 8;
        }
    };
    Animation.prototype.draw = function () {
        var _this = this;
        try {
            this.canvas = document.getElementById(this.elementID);
            var ctx = this.canvas.getContext("2d");
            var centerX = this.canvas.width / 2;
            var centerY = this.canvas.height / 2;
            ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            this.outerCircle(ctx, centerX, centerY);
            this.innerCircle(ctx, centerX, centerY);
            this.bars(ctx, centerX, centerY);
            if (this.loop) {
                window.requestAnimationFrame(function () { return _this.draw(); });
            }
        }
        catch (_a) {
            if (this.loop) {
                window.requestAnimationFrame(function () { return _this.draw(); });
            }
        }
    };
    return Animation;
}());
exports.Animation = Animation;
//# sourceMappingURL=animation.js.map