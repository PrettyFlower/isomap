/// <reference path='Window.d.ts' />

// from http://paulirish.com/2011/requestanimationframe-for-smart-animating/
// shim layer with setTimeout fallback
var requestAnimFrame = window.requestAnimationFrame   || 
    window.webkitRequestAnimationFrame || 
    window.mozRequestAnimationFrame    || 
    window.oRequestAnimationFrame      || 
    window.msRequestAnimationFrame     || 
    function( callback ){
        window.setTimeout(callback, 1000 / 60);
    };

class Util {    
    static propCount(obj) {
        var count = 0;
        for(var p in obj) {
            count++;
        }
        return count;
    }
    
    // from: http://stackoverflow.com/questions/1007981/how-to-get-function-parameter-names-values-dynamically-from-javascript
    static getParamNames(func: (...args: any[]) => any) {
        var funStr = func.toString();
        return funStr.slice(funStr.indexOf('(')+1, funStr.indexOf(')')).match(/([^\s,]+)/g);
    }
    
    // from: https://github.com/substack/point-in-polygon/blob/master/index.js
    static pointInPolygon(p: Point, vs: Point[]) {
        
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var p1 = vs[i];
            var p2 = vs[j];
            
            var intersect = ((p1.y > p.y) != (p2.y > p.y))
                && (p.x < (p2.x - p1.x) * (p.y - p1.y) / (p2.y - p1.y) + p1.x);
            if (intersect) inside = !inside;
        }
        
        return inside;
    };
};

class Point {
    constructor(public x: number, public y: number) {}
}

class Color {
    constructor(public r: number, public g: number, public b: number, public a: number){}
}

function offsetColor(c: Color, n: number) {
    return new Color(c.r + n, c.g + n, c.b + n, c.a);
}