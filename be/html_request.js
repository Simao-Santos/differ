const got = require('got');
const iconv = require("iconv-lite");

// When using got, the ECONNREFUSED error was constantly ocurring, probably because of some package interferences
// This chunk of code fixes the issue (https://github.com/sindresorhus/got/issues/876#issuecomment-573348808)
const http = require('http');
const https = require('https');
const urlToOptions = require('got/dist/source/core/utils/url-to-options').default;

const instance = got.extend({
    request: (url, options, callback) => {
        if (url.protocol === 'https:') {
            return https.request({...options, ...urlToOptions(url)}, callback);
        }

        return http.request({...options, ...urlToOptions(url)}, callback);
    }
});

// Makes GET request to URL
async function getRequest(url) {
    console.log('Retrieving page content for ' + url + '...');

    try {
        // The content will be outputted as a buffer, that will consequently be decoded to an UTF-8 string
        const bufferContent = await instance(url, { responseType: 'buffer', resolveBodyOnly: true });

        let stringContent = iconv.decode(bufferContent, 'utf-8');

        // The stringContent will be searched for a meta tag stating the content encoding
        // If it is found, the buffer will be decoded
        const regex = /<meta.*content="text\/html; charset=[A-Za-z0-9_-]+"/i;

        let resultingStrArr = stringContent.match(regex);

        if(resultingStrArr != null && resultingStrArr.length > 0) {
            // Gets the substring with the encoding
            let resultingStr = resultingStrArr[0];
            let encoding = resultingStr.substring(resultingStr.lastIndexOf('=') + 1, resultingStr.lastIndexOf('\"'));

            if(encoding != 'UTF-8') {
                console.log('Converting page to UTF-8 from ' + encoding + ' encoding...');

                // Convert to a (UTF-8-encoded) string
                stringContent = iconv.decode(bufferContent, encoding);

                // Replace charset meta info with UTF-8
                stringContent = stringContent.replace('charset=' + encoding, 'charset=utf-8');
            }
        }

        console.log('Page content retrieved');

        return stringContent;
    }
    catch (error) {
        console.log('Error retrieving page content: ' + error);
        return null;
    }
}

// Makes a POST request to URL
// TODO: not yet implemented
async function postRequest(url) {
    console.log('Not implemented...');
    return null;
}

module.exports.getRequest = getRequest;
module.exports.postRequest = postRequest;