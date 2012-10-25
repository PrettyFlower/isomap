class Tile {
    constructor(public x: number, public y: number,
        public topHeight: number, public botHeight: number,
        public leftHeight: number, public rightHeight: number,
        public height: number) {
        
    }
}


$(function() {
    var canvas = <HTMLCanvasElement>$('#canvas')[0];
    var ctx = canvas.getContext('2d');
    
    var width = 64;
    var height = 60;
    var vHeight = 12;
    var mapSize = 256;
    
    var tileImgs = {};
    for(var i = -1; i <= 1; i++) {
        tileImgs[i] = {};
        for(var j = -1; j <= 1; j++) {
            tileImgs[i][j] = {};
            for(var k = -1; k <= 1; k++) {
                tileImgs[i][j][k] = {};
                for(var l = -1; l <= 1; l++) {
                    var tileImg = makeTile(i, j, k, l, width, height, vHeight, 32);
                    tileImgs[i][j][k][l] = tileImg;
                    //ctx.drawImage(tileImg, i * 96 + k * 96 * 4 + 800, j * 96 + l * 96 * 4 + 800);
                }
            }
        }
    }
    
    //return;
    
    var tiles = [];
    for(var x = 0; x < mapSize; x++) {
        var col = [];
        for(var y = 0; y < mapSize / 2; y++) {
            col.push(new Tile(x, y, 0, 0, 0, 0, 0));
        }
        tiles.push(col);
    }
    
    tiles[4][2].botHeight = 1;
    tiles[4][3].topHeight = 1;
    tiles[4][3].botHeight = -1;
    tiles[4][4].topHeight = -1;
    tiles[3][3].rightHeight = -1;
    tiles[5][3].leftHeight = -1;
    tiles[3][2].rightHeight = 1;
    tiles[5][2].leftHeight = 1;
    
    tiles[5][0].botHeight = -1;
    tiles[5][1].topHeight = -1;
    tiles[4][1].rightHeight = -1;
    tiles[6][1].leftHeight = -1;
    
    tiles[5][1].botHeight = 1;
    tiles[5][2].topHeight = 1;
    tiles[4][2].rightHeight = 1;
    tiles[6][2].leftHeight = 1;
    
    tiles[5][3].rightHeight = 1;
    tiles[7][3].leftHeight = 1;
    tiles[6][3].botHeight = 1;
    tiles[6][4].topHeight = 1;
    
    tiles[9][2].height = 6;
    tiles[9][2].botHeight = -1;
    tiles[9][2].leftHeight = -1;
    //tiles[9][2].rightHeight = -1;
    //tiles[9][2].topHeight = -1;
    
    var start = new Date().getTime();
    
    for(var y = 0; y < tiles[0].length; y++) {
        for(var x = 0; x < tiles.length; x+=2) {
            drawTile(ctx, tiles[x][y], tileImgs, width, height, vHeight);
        }
        for(var x = 1; x < tiles.length; x+=2) {
            drawTile(ctx, tiles[x][y], tileImgs, width, height, vHeight);
        }
    }
    
    console.log(new Date().getTime() - start);
});

function rh() {
    return Math.floor(Math.random() * 3) - 1;
}

function makeTile(topHeight: number, botHeight: number, leftHeight: number, rightHeight: number,
    width: number, height: number, vHeight: number, colorVariation: number) {
    var canvas = <HTMLCanvasElement>document.createElement('canvas');
    canvas.width = width;
    canvas.height = 300;
    var ctx = canvas.getContext('2d');
    
    var l = new Point(0, height / 2 - leftHeight * vHeight + vHeight);
    var b = new Point(width / 2, height - botHeight * vHeight + vHeight);
    var r = new Point(width, height / 2 - rightHeight * vHeight + vHeight);
    var t = new Point(width / 2, -topHeight * vHeight + vHeight);
    
    // color in
    var imgData = ctx.getImageData(0, 0, width, canvas.height);
    var data = imgData.data;
    
    var polys = [];
    var offset: number;
    var color = new Color(200, 129, 78, 255);
    if(leftHeight == rightHeight) {
        polys.push({
            color: offsetColor(color, -botHeight * 32),
            poly: [l, b, r]
        });
        polys.push({
            color: offsetColor(color, topHeight * 32),
            poly: [l, t, r]
        });
    }
    else if(topHeight == botHeight) {
        polys.push({
            color: offsetColor(color, leftHeight == 0 ? 0 : 16),
            poly: [l, b, t]
        });
        polys.push({
            color: offsetColor(color, rightHeight == 0 ? 0 : 16),
            poly: [r, b, t]
        });
    }
    else {
        polys.push({
            color: offsetColor(color, topHeight > leftHeight || topHeight > rightHeight ? 24 : -24), 
            poly: [l, b, r, t]
        });
    }
    
    for(var i = 0; i < polys.length; i++) {
        var poly = polys[i];
        colorPoly(poly.poly, poly.color, 32, data, canvas.width);
    }
    
    colorPoly([l, b, new Point(b.x, canvas.height - b.y), new Point(0, canvas.height - b.y)],
        new Color(128, 128, 128, 255), 32, data, canvas.width);
    colorPoly([r, b, new Point(b.x, canvas.height - b.y), new Point(r.x, canvas.height - b.y)],
        new Color(160, 160, 160, 255), 32, data, canvas.width);
    
    imgData.data = data;
    ctx.putImageData(imgData, 0, 0);
    
    // draw gridlines
    
    // left
    ctx.moveTo(l.x, l.y);
    
    // left to bot
    ctx.lineTo(b.x, b.y);
    
    // bot to right
    ctx.lineTo(r.x, r.y);
    
    // right to top
    ctx.lineTo(t.x, t.y);
    
    // top to left
    ctx.lineTo(l.x, l.y);
    
    // base
    ctx.lineTo(l.x, canvas.height);
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x, canvas.height);
    ctx.moveTo(r.x, r.y);
    ctx.lineTo(r.x, canvas.height);
    
    if(leftHeight != -1 || botHeight != -1) {
        ctx.moveTo(l.x, height / 2 + vHeight * 2);
        ctx.lineTo(b.x, height + vHeight * 2);
    }
    if(rightHeight != -1 || botHeight != -1) {
        ctx.moveTo(r.x, height / 2 + vHeight * 2);
        ctx.lineTo(b.x, height + vHeight * 2);
    }
    
    var start = Math.max(l.y, r.y);
    for(var i = start + vHeight; i < canvas.height - vHeight; i += vHeight) {
        ctx.moveTo(l.x, i);
        ctx.lineTo(b.x, i + height / 2);
        ctx.lineTo(r.x, i);
    }
    
    ctx.strokeStyle = '#000';
    ctx.stroke();
    
    /*ctx.fillText(topHeight.toString(), t.x, t.y + 10);
    ctx.fillText(leftHeight.toString(), l.x + 10, l.y);
    ctx.fillText(botHeight.toString(), b.x, b.y - 10);
    ctx.fillText(rightHeight.toString(), r.x - 10, r.y);*/
    
    return canvas;
}

function colorPoly(poly: Point[], color: Color, colorVariation: number, data, width: number) {
    var min = new Point(Number.MAX_VALUE, Number.MAX_VALUE);
    var max = new Point(Number.MIN_VALUE, Number.MIN_VALUE);
    for(var i = 0; i < poly.length; i++) {
        var p = poly[i];
        if(p.x < min.x) min.x = p.x;
        if(p.y < min.y) min.y = p.y;
        if(p.x > max.x) max.x = p.x;
        if(p.y > max.y) max.y = p.y;
    }
    
    for(var x = min.x; x < max.x; x++) {
        for(var y = min.y; y < max.y; y++) {
            if(Util.pointInPolygon(new Point(x, y), poly)) {                
                var idx = (x + y * width) * 4;
                
                data[idx + 0] = r(colorVariation, color.r);
                data[idx + 1] = r(colorVariation, color.g);
                data[idx + 2] = r(colorVariation, color.b);
                data[idx + 3] = color.a;
            }
        }
    }
}

function r(colorVariation: number, offset: number) {
    return Math.floor(Math.random() * colorVariation) - colorVariation / 2 + offset;
}

function drawTile(ctx: CanvasRenderingContext2D, tile: Tile, tileImgs, width: number, height: number, vHeight: number) {
    var x = (tile.x / 2) * width - width / 2;
    var y = tile.y * height - tile.height * vHeight;
    
    if(tile.x % 2 == 1) {
        y += height / 2;
    }
    
    y -= height / 2 + vHeight;
    
    ctx.drawImage(tileImgs[tile.topHeight][tile.botHeight][tile.leftHeight][tile.rightHeight], x, y);
}