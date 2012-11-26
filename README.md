# Socket.IO RedisStore Test Case

RedisStore is leaking pubsub channels when using xhr-polling. This is a simple test to demonstrate the issue.

The test comprises of a server and load test. The server runs a stripped down Socket.IO server. The load test connects 1 client every second until it reaches 100. 

As the test runs the server logs the following data to a gnuplot friendly file.

* Seconds elapsed
* Connected sockets 
* Redis PubSub channels

## Running Tests

A test has been created for running on a single process. For the single process run

    node server.js

For a test using clustered processes (using Node's cluster module) run

    node cluster.js

Then in another tab launch the load test

    node .load.js

The load test will exit after 100 connections have been established. 

For both tests wait until you see that Socket.IO has fired the close timeout event for the xhr connections. 

     info  - transport end (close timeout)

The tests generate a gnuplot friendly file that you can use to generate graphs.

## Generating graphs

To generate graphs you will need gnuplot installed on your machine. On OSX you can get this using homebrew with

    brew install gnuplot

To generate the graph for the single process run

    gnuplot server.p

You can then open the graph with

    open server.png

To generate the graph for the clustered process run 

    gnuplot cluster.p

You can then open the graph with

    open cluster.png
