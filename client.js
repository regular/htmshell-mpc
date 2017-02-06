
console.log('**** HELLO FROM YOUR FRIENDLY MPC!');

var shoe = require('shoe');
var split = require('split');
let mpc = shoe('/mpc');
setInterval( ()=> {
    mpc.write('status\n');
    return true;
}, 5000);
for(let btn of 'prev play pause next'.split(' ')) {
    document.querySelector(`#mpc .${btn}`).addEventListener('click', ()=>{
        //t.io.println(`${btn}!`);
        mpc.write(`${btn}\nstatus\n`);
    });
}
mpc.pipe(split()).on('data', function (msg) {
    let meta = msg.match(/artist=([^\t]*)\ttitle=([^\t]*)\tduration=(\d*)\s*/);
    let progress = msg.match(/\[(\w+)\]\s+\#(\d+)\/(\d+)\s+(\d+)\:(\d+)\/(\d+)\:(\d+)\s*.*/);
    let status = msg.match(/volume: (\d+)%\s+repeat: (on|off)\s+random: (on|off)\s+single: (on|off)\s+consume: (on|off)/);
    if (meta) {
        let [_,artist,title,duration] = meta;
        //t.io.println(`title: ${title}`);
        let el = document.querySelector('#mpc .title');
        el.innerHTML = title;
    } else if (progress) {
        let [_, transport, listPos, listLen, curMin, curSec, durMin, durSec] = progress;
        if (transport === 'playing') {
            document.querySelector('#mpc .play').style.display = 'none';
            document.querySelector('#mpc .pause').style.display = 'initial';
        } if (transport === 'paused') {
            document.querySelector('#mpc .play').style.display = 'initial';
            document.querySelector('#mpc .pause').style.display = 'none';
        }
        //t.io.println(`transport: ${transport} pos: ${curMin}:${curSec}`);
    } else if (status) {
        let [_, volume, repeat, random, single, consume] = status;
        //t.io.println(`volume: ${volume}`);
    } else {
        //t.io.println(msg);
    }
});
