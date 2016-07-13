# node-simplecrawler-i298
Reproduction scenario for https://github.com/cgiffard/node-simplecrawler/issues/298.

## Test scenario

The test scenario includes a simple HTTP server and a simple crawler.

The server serves the following routes (with gzip always enabled - this is important):
* `/` - index.html
* `/p1` - p1.html
* `/p2` - p2.html

Note: In order to simulate processing time, the server sleeps for 3000ms before serving `/`.

The crawler has an interval of 1ms (i.e. it attempts to fetch an item from the queue every 1ms).

## Running the test scenario
Clone/install the repository:
```bash
$ git clone git@github.com:HugoMFernandes/node-simplecrawler-i298.git
$ cd node-simplecrawler-i298
$ npm install
```

Start the server (it will start on port 32714):
```bash
$ node server.js
```

Start the crawler:
```bash
$ node crawler.js
```

## Expected behavior

The crawler should:
1. Fetch `/` (i.e. index.html)
2. Unzip the response data
3. Discover both `/p1` and `/p2`, adding them to the crawl queue
4. Continue crawling (picking `/p1` and `/p2` up eventually)

## Observed behavior

The crawler:
1. Fetches `/`
2. Stops the crawling process while unziping the response data (this call is async within the code itself)
3. Discovers both `/p1` and `/p2`, adding them to the queue
4. The process exits (as the crawler has already stopped, even though it now has pending items in the queue)

## Problem explanation
When the responses need to be deflated/unzipped, the crawler's `crawl()` flow is not entirely synchronous. As such, it updates the flag that it uses to know if the crawling process is done or not before adding the discoverables (which come from the result of the deflation) to the queue. A fix is proposed here: https://github.com/cgiffard/node-simplecrawler/pull/299.
