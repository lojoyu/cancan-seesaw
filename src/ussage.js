export function importAll(r) {
    return r.keys().map(r);
}

export function minmax(x, minnum, maxnum) {
    return Math.max(minnum, Math.min(maxnum, x));
}

export function scale(x, frommin, frommax, tomin, tomax) {
    return (x-frommin)/(frommax-frommin) * (tomax-tomin) + tomin;
}

export function json2Str(jsonData) {
    let html = "";
    for (let k in jsonData) {
        if (!k) continue;
        html += `${k}: ${jsonData[k]>0?"+":""}${jsonData[k].toFixed(3)} </br>`
    }
    return html;
}

export class Avg {
    constructor(size = 10) {
        this.size = size;
        this.buffer = [];
        this.ind = 0;
    }

    get(now = null) {
        if (now != null) {
            if (this.buffer.length < this.size) {
                this.buffer.push(now);
            } else 
                this.buffer[this.ind] = now;
            this.ind = (this.ind + 1) % this.size;
        }
        return this.calcAvg();
    }

    calcAvg() {
        if (this.buffer.length == 0) return 0;
        let sum = 0;
        for (let i=0; i<this.buffer.length; i++) {
            sum += this.buffer[i];
        }
        //return sum + "<br>" + this.buffer.length + "<br>" + sum/this.buffer.length;
        let g = sum / this.buffer.length;
        return g == Infinity ? this.buffer[(this.ind-1+this.size)%this.size] : g;
    }
}

export function random(min, max, integer=true) {
    let r = (Math.random()*(max-min));
    if (integer) r = Math.floor(r);
    return r+min;
}

export function drunk(prev, step, integer=true) {
    let r = Math.random()*step*2-step
    if (integer) r = Math.floor(r);
    return prev + r;
}

export function randomMore(prev, step, min, max, integer=true) {
    let r = 0;
    if (Math.random() > 0.5 && prev+step < max) {
        r = Math.random()*(max-(prev+step));
    } else {
        r = Math.random()*((prev-step)-min);
    }
    if (integer) r = Math.floor(r);
    return prev + r;
}

export function watch(j, cb, prop='value') {
    return new Proxy(JSON.parse (`{"${prop}":' + j + '}`), {
        set: function(target, property, value) {
            // do something
            console.log("check4 value changed from "
            + target[property] + " to " + value)
            target[property] = value
            cb(value)
        }
    });
}