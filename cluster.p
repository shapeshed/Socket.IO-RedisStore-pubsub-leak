set terminal png
set output "cluster.png"
set title "Clustered Socket.IO / RedisStore xhr-polling"
set size 1,0.7

set grid y
set xlabel "time elapsed (s)"
set ylabel "count"

plot "report.1.dat" using 1:3 smooth sbezier with lines title "pubsub channels" , "report.1.dat" using 1:2 smooth sbezier with lines title "sockets"
