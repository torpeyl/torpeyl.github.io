let gridSize = 20;
let cols, rows;

let directions = [
    {dx:1,dy:0},{dx:1,dy:-1},{dx:0,dy:-1},{dx:-1,dy:-1},
    {dx:-1,dy:0},{dx:-1,dy:1},{dx:0,dy:1},{dx:1,dy:1}
];

let tracePairs = [
    // {start:{x:2,y:2}, end:{x:10,y:14}},
    // {start:{x:10,y:2}, end:{x:2,y:10}}
];

let blockedCells = new Set();
let usedEdges = new Set();
let paths = [];
let traceLights = [];

let maskedGradient;

function setup(){
    let displayDim = Math.max(displayWidth, displayHeight);
    frameRate(30);
    createCanvas(displayDim, displayDim);
    pixelDensity(1);

    objectLayer = createGraphics(displayDim, displayDim);
    gradientLayer = createGraphics(displayDim, displayDim);
    backgroundLayer = createGraphics(displayDim, displayDim);
    finalImage = createImage(displayDim, displayDim);

    // Define grid for routing traces
    cols = Math.ceil(displayDim / gridSize);
    rows = Math.ceil(displayDim / gridSize);

    // Create a set of trace paths
    suc_counter = 0;
    fail_counter = 0;
    while((suc_counter < 100) && (fail_counter < 30)) {
        // t = {start: {x: getRndInteger(0, cols), y: getRndInteger(0, rows)}, end: {x: getRndInteger(0, cols), y: getRndInteger(0, rows)}};
        let t = getRndPair();

        if(blockedCells.has(`${t.start.x},${t.start.y}`) || blockedCells.has(`${t.end.x}, ${t.end.y}`)) {
            // console.log('Start or end points are in blocked cells');
            fail_counter++;
            continue;
        }

        if (t.start != t.end) {
            // let h = getInitialHeading(t.start, t.end);
            // let p = bfsRoute(t.start, t.end, h);
            let p = bfsRoute(t.start, t.end);
            if (p) {
                // mark cells & edges used
                p.forEach(pt => blockedCells.add(`${pt.x},${pt.y}`));
                for (let i = 0; i < p.length - 1; i++) {
                    let a = p[i], b = p[i+1];
                    usedEdges.add(edgeKey(a,b));
                    usedEdges.add(edgeKey(b,a));
                }
                paths.push(p);
                suc_counter++;
                tracePairs.push(t)
            } else {
                // console.log('Failed to route', t);
                fail_counter++;
            }
        }
    }


    // Draw traces, including the end circles
    // objectLayer.stroke('#53e4e9ff');
    objectLayer.stroke('#ffffff');
    objectLayer.noFill(); 
    for(let i=0; i < paths.length; i++){
        // stroke('#0f756cff');
        // stroke('#3fd3dbff');
        // stroke('#0c59bc');
        objectLayer.strokeWeight(5);
        objectLayer.beginShape();
        paths[i].forEach(p => vertex(p.x*gridSize+gridSize/2,p.y*gridSize+gridSize/2));
        objectLayer.endShape();

        // objectLayer.fill(25);
        objectLayer.strokeWeight(2);
        objectLayer.ellipse(tracePairs[i].start.x * gridSize + gridSize / 2, tracePairs[i].start.y * gridSize + gridSize / 2, 12);
        objectLayer.ellipse(tracePairs[i].end.x * gridSize + gridSize / 2, tracePairs[i].end.y * gridSize + gridSize / 2, 12);
    }

    // Now we want to setup the static parts of the background
    drawGradient(gradientLayer);

    gradientLayer.stroke('#000000');
    gradientLayer.fill('#000000');
    gradientLayer.strokeWeight(2);
    for(let i=0; i < paths.length; i++){
        // objectLayer.noFill();
        gradientLayer.ellipse(tracePairs[i].start.x * gridSize + gridSize / 2, tracePairs[i].start.y * gridSize + gridSize / 2, 8);
        gradientLayer.ellipse(tracePairs[i].end.x * gridSize + gridSize / 2, tracePairs[i].end.y * gridSize + gridSize / 2, 8);
    }

    applyGradientTint(objectLayer, gradientLayer, finalImage);

    backgroundLayer.background('#041018ff');
    backgroundLayer.stroke('#091d2cff');
    backgroundLayer.strokeWeight(2);
    backgroundLayer.noFill();
    // Draw background grid
    for(let x=0;x<cols;x++)for(let y=0;y<rows;y++) {
        backgroundLayer.rect(x*gridSize, y*gridSize, gridSize, gridSize);
    }

    image(backgroundLayer, 0, 0);
    image(finalImage, 0, 0);

    // Create mask image
    let maskImage = objectLayer.get(); // Returns p5.Image
    let gradientImage = gradientLayer.get();

    gradientImage.mask(maskImage); // keep only where objectLayer is visible
    maskedGradient = gradientImage;

    var loadingScreenDiv = document.getElementById('loadingScreen');
    loadingScreenDiv.style.display = 'none';
}

function draw(){
    // background('#041018ff');
    // stroke('#091d2cff');
    // strokeWeight(2);
    // noFill();
    // // Draw background grid
    // for(let x=0;x<cols;x++)for(let y=0;y<rows;y++) {
    //     rect(x*gridSize, y*gridSize, gridSize, gridSize);
    // }


    // // Draw traces, including the end circles
    // for(let i=0; i < paths.length; i++){
    //     // stroke('#0f756cff');
    //     // stroke('#3fd3dbff');
    //     // stroke('#0c59bc');
    //     objectLayer.stroke('#53e4e9ff');
    //     objectLayer.strokeWeight(5);
    //     objectLayer.noFill(); 
    //     objectLayer.beginShape();
    //     paths[i].forEach(p => vertex(p.x*gridSize+gridSize/2,p.y*gridSize+gridSize/2));
    //     objectLayer.endShape();

    //     // objectLayer.fill(25);
    //     objectLayer.strokeWeight(2);
    //     objectLayer.noFill();
    //     objectLayer.ellipse(tracePairs[i].start.x * gridSize + gridSize / 2, tracePairs[i].start.y * gridSize + gridSize / 2, 12);
    //     objectLayer.ellipse(tracePairs[i].end.x * gridSize + gridSize / 2, tracePairs[i].end.y * gridSize + gridSize / 2, 12);
    // }

    // //   1. Draw a shape (or lines) to objectLayer (white on transparent)
    // // drawShapes(objectLayer);

    // // 2. Draw a vertical gradient over entire canvas
    // drawGradient(gradientLayer);

    // // 3. Tint object with matching gradient pixel-by-pixel
    // applyGradientTint(objectLayer, gradientLayer, finalImage);
    // image(finalImage, 0, 0);


    // for(let i=0; i < paths.length; i++){
    //     stroke('#041018ff');
    //     fill('#041018ff');
    //     strokeWeight(2);
    //     // objectLayer.noFill();
    //     ellipse(tracePairs[i].start.x * gridSize + gridSize / 2, tracePairs[i].start.y * gridSize + gridSize / 2, 7);
    //     ellipse(tracePairs[i].end.x * gridSize + gridSize / 2, tracePairs[i].end.y * gridSize + gridSize / 2, 7);
    // }

    // background('#002832ff');
    image(backgroundLayer, 0, 0);
    image(maskedGradient, 0, 0);

    // Randomly initialise a trace light
    if (Math.random() < 0.05) {    // 0.065
        lit_trace_idx = getRndInteger(0, paths.length - 1);
        traceLights.push(new Trace_Light(lit_trace_idx));
    }

    // Update the position of all of the trace lights
    let toDelete = -1;
    for (let i=0; i < traceLights.length; i++){
        let result = traceLights[i].update_pos();
        if (result == 1){
            toDelete = i;
        }
    }
    
    // If a light has reached the end of its trace, delete it
    if (toDelete != -1){
        traceLights.splice(toDelete, 1);
    }

    // Display all of the remaining trace lights
    for (let i=0; i < traceLights.length; i++){
        traceLights[i].display();
    }

    // console.log(frameRate());
}

function normalRandom(mean=(cols / 4.5), stdDev=(cols / 4)) {
    let u = 0, v = 0;
    while (u === 0) u = Math.random(); // Avoid 0
    while (v === 0) v = Math.random();
    let z = Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
    return z * stdDev + mean;
}

function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}

function getRndPair() {
    let start = {x: getRndInteger(0, cols), y: getRndInteger(0, rows)};
    let distance = normalRandom();  // normally distributed distance
    let angle = Math.random() * 2 * Math.PI;

    let x = start.x + distance * Math.cos(angle);
    let y = start.y + distance * Math.sin(angle);

    // Wait until x and y are within the grid limits, the length of the trace is long enough, and the start and end points are separate
    while ((x < 0) || (y < 0) || (x >= cols) || (y >= rows) || (abs(distance) <= 3) || ((x == start.x) || (y == start.y))) {
        distance = normalRandom();  // normally distributed distance
        angle = Math.random() * 2 * Math.PI;

        x = start.x + distance * Math.cos(angle);
        y = start.y + distance * Math.sin(angle);
    }

    return {start: start, end: {x: Math.floor(x), y: Math.floor(y)}};
}

// // BFS with full corner & edge checks
// function bfsRoute(start,end,heading){
//     let Q=[{x:start.x,y:start.y,heading, path:[{x:start.x,y:start.y}]}];
//     let seen = new Set([`${start.x},${start.y},${heading}`]);

//     while(Q.length){
//         let cur = Q.shift();
//         if(cur.x===end.x && cur.y===end.y) return cur.path;

//         for(let d=-1;d<=1;d++){
//             let nh=(cur.heading+d+8)%8;
//             let dir = directions[nh];
//             let nx=cur.x+dir.dx, ny=cur.y+dir.dy;
//             let key=`${nx},${ny},${nh}`;
//             if(nx<0||ny<0||nx>=cols||ny>=rows) continue;
//             if(seen.has(key)) continue;

//             // blocked cell?
//             if(blockedCells.has(`${nx},${ny}`)) continue;

//             // reusing edge?
//             let ek = edgeKey(cur, {x:nx,y:ny});
//             if(usedEdges.has(ek)) continue;

//             // corner crossing check for diagonals
//             if(dir.dx && dir.dy){
//                 if(blockedCells.has(`${cur.x+dir.dx},${cur.y}`) &&
//                 blockedCells.has(`${cur.x},${cur.y+dir.dy}`)){
//                 continue;
//                 }
//             }

//             seen.add(key);
//             Q.push({
//                 x:nx,y:ny,heading:nh,
//                 path:[...cur.path, {x:nx,y:ny}]
//             });
//         }
//     }
//     return null;
// }

function bfsRoute(start, goal) {
    let queue = [];
    let visited = new Set();

    // Start with ALL 8 headings
    for (let h = 0; h < 8; h++) {
        queue.push({ x: start.x, y: start.y, heading: h, path: [{x: start.x, y: start.y}] });
        visited.add(`${start.x},${start.y},${h}`);
    }

    while (queue.length > 0) {
        let current = queue.shift();
        let { x, y, heading, path } = current;

        if (x === goal.x && y === goal.y) return path;

        for (let delta = -1; delta <= 1; delta++) {
            let newHeading = (heading + delta + 8) % 8;
            let dir = directions[newHeading];
            let nx = x + dir.dx;
            let ny = y + dir.dy;
            let key = `${nx},${ny},${newHeading}`;
            if (nx < 0 || ny < 0 || nx >= cols || ny >= rows) continue;
            if (visited.has(key)) continue;

            if (blockedCells.has(`${nx},${ny}`)) continue;
            let ek = edgeKey({ x, y }, { x: nx, y: ny });
            if (usedEdges.has(ek)) continue;

            // Optional: diagonal corner-blocking check
            if (dir.dx && dir.dy) {
                if (blockedCells.has(`${x+dir.dx},${y}`) && blockedCells.has(`${x},${y+dir.dy}`)) continue;
            }

            visited.add(key);
            queue.push({
                x: nx,
                y: ny,
                heading: newHeading,
                path: [...path, { x: nx, y: ny }]
            });
        }
    }

    return null; // No path found
}

function edgeKey(a,b){ 
    return `${a.x},${a.y}->${b.x},${b.y}`; 
}

function getInitialHeading(a,b){
    let angle = atan2(-(b.y-a.y), b.x-a.x);
    let h = ((round(degrees(angle)/45)) + 8)%8;
    return h;
}

class Trace_Light {
    constructor(trace_idx, r=5, s=null) {
        this.trace = tracePairs[trace_idx];
        this.trace_path = paths[trace_idx];
        this.r = r;
        this.speed = s;
        // this.colour = color('#12eac2ff');
        this.colour = color('#8afbffff');
        this.baseColor = color(50, 50, 200);
        this.hue = 180;

        if (this.speed == null) {
            this.speed = getRndInteger(5, 10);
        }

        this.x = this.trace.start.x * gridSize + gridSize / 2;
        this.y = this.trace.start.y * gridSize + gridSize / 2;

        this.trace_abs_pos = {start: {x: this.trace.start.x * gridSize + gridSize / 2, y: this.trace.start.y * gridSize + gridSize / 2}, end: {x: this.trace.end.x * gridSize + gridSize / 2, y: this.trace.end.y * gridSize + gridSize / 2}};
        this.abs_len = ((this.trace_abs_pos.end.x - this.trace_abs_pos.start.x) ** 2 + (this.trace_abs_pos.end.y - this.trace_abs_pos.start.y) ** 2) ** 0.5;
        this.manhatten_len = [(this.trace_abs_pos.end.x - this.trace_abs_pos.start.x), (this.trace_abs_pos.end.y - this.trace_abs_pos.start.y)];

        // Calculate the total length of the trace
        this.path_length = 0;
        this.path_ckpts = [0];
        for (let i = 0; i < (this.trace_path.length - 1); i++) {
            let a = this.trace_path[i];
            let b = this.trace_path[i + 1];
            let cur_path_len = (((b.x - a.x) ** 2 + (b.y - a.y) ** 2) ** 0.5) * gridSize;
            this.path_length += cur_path_len;
            this.path_ckpts.push(this.path_length);
        }

        this.cur_path_idx = 0;
        this.dist_travelled = 0;
        this.next_path_dist = ((this.trace_path[0].x - this.trace_path[1].x) ** 2 + (this.trace_path[0].y - this.trace_path[1].y)) ** 0.5;

        // Setup light trail variables
        this.lightPos = createVector(this.x, this.y);
        this.trail = [];
        this.maxTrail = 10;

        /* 

        + In the update loop we need to keep track of the distance travelled. (Regardless of direction)
        + We then add the speed to the distance travelled
        + We then check that this distance is less than the trace length
        + We then work out between which two path points this would place the point.

        */
    }

    update_pos() {
        this.dist_travelled += this.speed;

        if (this.cur_path_idx >= this.path_ckpts.length-1){
                return 1;
        }

        if (!((this.dist_travelled >= this.path_ckpts[this.cur_path_idx]) && (this.dist_travelled < this.path_ckpts[this.cur_path_idx + 1]))) {
            this.cur_path_idx++;
            if (this.cur_path_idx >= this.path_ckpts.length-1){
                return 1;
            }
        }

        let dist_since_ckpt = this.dist_travelled - this.path_ckpts[this.cur_path_idx];
        // Get each of the end points and work out the difference in x and y between the start and end.
        // Also work out the length of the section between the two vertices
        let delta_x = this.trace_path[this.cur_path_idx+1].x - this.trace_path[this.cur_path_idx].x;
        let delta_y = this.trace_path[this.cur_path_idx+1].y - this.trace_path[this.cur_path_idx].y;
        let sect_length = ((delta_x) ** 2 + (delta_y) ** 2) ** 0.5;

        this.x = (dist_since_ckpt * delta_x / sect_length) + (this.trace_path[this.cur_path_idx].x * gridSize) + gridSize / 2;
        this.y = (dist_since_ckpt * delta_y / sect_length) + (this.trace_path[this.cur_path_idx].y * gridSize) + gridSize / 2;

        return 0;
    }

    display() {
        noStroke();
        this.lightPos = createVector(this.x, this.y);
        this.trail.push(this.lightPos.copy());
        if (this.trail.length > this.maxTrail) {
            this.trail.shift();
        }

        for (let i = 0; i < this.trail.length; i++) {
            let p = this.trail[i];
            let alpha = map(i, 0, this.trail.length, 0, 100);
            let r = map(i, 0, this.trail.length, 5, 7);
            this.drawGlow(p.x, p.y, r, color(0, 255, 150, alpha));
        }

        // Draw main light
        this.drawGlow(this.lightPos.x, this.lightPos.y, this.r, this.colour);
        this.drawGlow(this.lightPos.x, this.lightPos.y, this.r / 2, color(0, 255, 255, 220));

        // -----------------------------------------------------
        // let d = dist(mouseX, mouseY, this.x, this.y);
        // let glow = map(d, 0, 250, 255, 50);
        // glow = constrain(glow, 50, 255);

        // push();
        // colorMode(HSB, 360, 100, 100, 255);
        // fill(this.hue - (glow / 3), 100, 100, glow);
        // drawingContext.shadowBlur = this.r;
        // drawingContext.shadowColor = this.colour; // color(this.hue, 100, 100);
        // ellipse(this.x, this.y, this.r);
        // pop();
    }

    drawGlow(x, y, radius, col) {
        for (let r = radius; r > 0; r -= 2) {
            let alpha_var = map(r, 0, radius, 0, alpha(col));
            fill(red(col), green(col), blue(col), alpha_var);
            ellipse(x, y, r * 2);
        }
    }
}

// --- Utility: Draw a gradient across the canvas
function drawGradient(pg) {
    for (let y = 0; y < pg.height; y++) {
        let inter = map(y, 0, pg.height, 0, 1);
        // let c = lerpColor(color(255, 0, 0), color(0, 0, 255), inter);
        // let c = lerpColor(color('#0e47cf'), color('#56f3f1'), inter);
        let c = lerpColor(color('#56f3f1'), color('#0e47cf'), inter);

        pg.stroke(c);
        pg.line(0, y, pg.width, y);
    }
}

// --- Core: apply per-pixel tint from gradient to object
function applyGradientTint(obj, grad, output) {
    obj.loadPixels();
    grad.loadPixels();
    output.loadPixels();

    for (let i = 0; i < output.pixels.length; i += 4) {
        let alpha = obj.pixels[i + 3];
        if (alpha > 0) {
            output.pixels[i + 0] = grad.pixels[i + 0]; // R
            output.pixels[i + 1] = grad.pixels[i + 1]; // G
            output.pixels[i + 2] = grad.pixels[i + 2]; // B
            output.pixels[i + 3] = alpha;              // A
        } else {
            output.pixels[i + 3] = 0;
        }
    }

    output.updatePixels();
}