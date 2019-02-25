// Include http ,url module.
var http = require('http');
var url = require('url');

// Create http server.
var httpServer = http.createServer(function (req, resp) {

    // Get client request url.
    var reqUrlString = req.url;

    // Get client request path name.
    var pathName = url.parse(reqUrlString, true, false).pathname;

    // If request login action.
    if('/login' == pathName)
    {
        // Get request method.
        var method = req.method;

        // If post.
        if("POST" == method)
        {
            var postData = '';

            // Get all post data when receive data event.
            req.on('data', function (chunk) {

                postData += chunk;

            });

            // When all request post data has been received.
            req.on('end', function () {

                console.log("Client post data : " + postData);

                // Parse the post data and get client sent username and password.
                var postDataObject = JSON.parse(postData);

                var userName = postDataObject.user_name;

                var password = postDataObject.password;

                /* Set Access-Control-Allow-Origin http header will fix No 'Access-Control-Allow-Origin' header is present on the requested resource error
                   when use XMLHttpRequest object to get this server page via ajax method. */
                resp.writeHead(200, {'Access-Control-Allow-Origin':'*'});

                if('jerry' == userName && '666666' == password)
                {
                    resp.end('User name and password is correct. ');
                }else
                {
                    resp.end('User name and password is not correct. ');
                }
            })
        }
    }
});

// Http server listen on port 8888.
httpServer.listen(8888);