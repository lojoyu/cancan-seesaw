import * as Tone from 'tone'
import {sounds} from '../sounds/sound'
//import DeviceMotion from 'web-devicemotion'
import DeviceMotion from '@zonesoundcreative/web-devicemotion'

let playing = [-1, -1]
let players = []
let gains = []

const reverb = new Tone.Reverb({
	"wet": 0.5,
	"decay": 1})
preload()
let dm = new DeviceMotion(true, motionCB);

let thr = [7, 9]
let pitchOff = 0
let appel
let pitch = 0

export let startAll = async () => {
    dm.requestPermission()
    await Tone.start()
    setupHtml()
    
}

function setupHtml() {
    appel = document.querySelector('#app-device')
    document.querySelector('#app-param').innerHTML = /*html*/`
    <button id="balance">設 pitch 為 0</button><br>
    <label>
        <span> 起始角度 <span>
        <input id="thr0" type="number" min="0" max="89" step="1" value=${thr[0]}>
    </label><br>
    <label>
        <span> ～角度 <span>
        <input id="thr1" type="number" min="1" max="90" step="1" value=${thr[1]}>
    </label><br><br>
    `
    document.querySelector('#balance').addEventListener('click', function (evt) {
        pitchOff = pitch
    });
    document.querySelector('#thr0').addEventListener('input', function (evt) {
        thr[0] = this.value
        if (thr[0] > thr[1]) {
            thr[1] = thr[0]+1
            document.querySelector('#thr1').setAttribute('value', thr[1])
        }
    });
    document.querySelector('#thr1').addEventListener('input', function (evt) {
        thr[1] = this.value
        if (thr[0] > thr[1]) {
            thr[0] = thr[1]-1
            document.querySelector('#thr0').setAttribute('value', thr[0])
        }
    });
}

function preload() {
    sounds.forEach(sound => {
        //const gainNode = new Tone.Gain(0).toDestination()
        const player = new Tone.Player(sound)
        const gainNode = new Tone.Gain(0)
        //player.volume.value = -0.5
        //player.fadeOut = 0.5
        //player.fadeIn = 0.5
        //const player2 = new Tone.Player(sound).toDestination()
        //player2.volume.value = -0.5
        //player2.fadeOut = 0.5
        //player2.fadeIn = 0.5
        //player.connect(reverb)
        player.chain(gainNode, reverb, Tone.Destination)
        console.log(player)
        players.push(player)
        gains.push(gainNode)
        //players[1].push(player2)
    });

    Tone.loaded().then(() => {
        console.log('all ready!')

        players.forEach(player => {
            //console.log(player, player.buffer?.duration)
            //if (player.buffer?.duration > 10) player.fadeIn = 
        })
        document.querySelector('#start').removeAttribute('disabled')
    });
}

function genSound(pitch) {
    
    
    let ind = Math.sign(pitch) * 0.5 + 0.5
    let abs = Math.abs(pitch)
    if (abs > thr[0]) {
        if (playing[ind] == -1) {   
            console.log('PLAYING------')
            for (let i=0; i<players.length; i++) {
                if (players[i].state == 'started')
                    console.log(i, players[i].state)
            }
            console.log('------')         
            playing[ind] = -2
            let r = Math.floor(Math.random() * players.length)
            while(players[r].state == 'started') {
                r = Math.floor(Math.random() * players.length)
            }
            playing[ind] = r
            players[r].start(0, 0)
            console.log(r, 'start')
            players[r].onstop = ()=>{
                console.log(r, '---')
                if (playing[ind] == r) {
                    gains[r].gain.rampTo(0, 0)
                    playing[ind] = -1
                }
            }
        } 
        let g = (abs - thr[0]) / (thr[1] - thr[0])
        g = Math.min(g, 1)
        gains[playing[ind]].gain.rampTo(g, 0.05)

    } 
    else {
        for (let i=0; i<2; i++) {
            if (playing[i]!= -1) {
                
                gains[playing[i]].gain.rampTo(0, 0.02)
                players[playing[i]].stop('+0.02')
                console.log(playing[i], 'stop', players[playing[i]].state)
                playing[i] = -1
            } 
        }
    }
}


function motionCB() {
    //console.log(JSON.parse(evt));
    //console.log(toString(dm.orient));
    genSound(dm.orient.pitch - pitchOff)
    appel.innerHTML = toHTMLString(dm.orient)
    pitch = dm.orient.pitch
    //if (dm.orient.pitch)
    // document.getElementById('orient').innerHTML = toString(dm.orient);
    // document.getElementById('vel').innerHTML = toString(dm.orientVel);
    // document.getElementById('acc').innerHTML = toString(dm.orientAcc);
}

function toHTMLString(jsonData) {
    let html = "";
    for (let k in jsonData) {
        if (!k) continue;
        let f = k=='pitch'? jsonData[k]-pitchOff: jsonData[k]
        html += `${k}: ${jsonData[k]>0?"+":""}${f.toFixed(3)} </br>`
    }
    return html;
}