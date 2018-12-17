var http = require("http");
var url = require("url") ;
var feed = require("feed-read");

var server = http.createServer(

  function(inRequest, inResponse) {

    try {

      var queryObject = url.parse(inRequest.url,true).query;
      var feedURLParts = url.parse(queryObject.feedURL);
      console.log(feedURLParts);

      feed(feedURLParts.href, function(inError, inArticles) {
        if (inError) {
          throw inError;
        }
        console.log(inArticles);
        inResponse.writeHead(200, { "Access-Control-Allow-Origin" : "*" });
        inResponse.end(JSON.stringify(inArticles));
      });
    } catch (inError) {
      console.log("ERROR: " + inError);
      inResponse.writeHead(500, { "Access-Control-Allow-Origin" : "*" });
      inResponse.end(inError.message);
    }

  }

).listen(8080);

console.log("Proxy server listening on port 8080");
