'use strict';

var Crawler = require('simplecrawler');

var crawler = new Crawler('127.0.0.1', '/', 32714);

crawler.interval = 1;
crawler.maxConcurrency = 1;


crawler.on('queueadd', function (queueItem) {
    console.log('Added %s to queue', queueItem.url);
});

crawler.on('fetchcomplete', function (queueItem, responseBuffer, response) {
    console.log('Received %s', queueItem.url);
});

crawler.on('complete', function () {
    console.log('Crawl complete');
});

crawler.start();

console.log('Crawler has started');
