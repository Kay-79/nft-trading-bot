bid:
	nohup npm run bid &
killBid:
	kill -9 $(shell ps aux | grep bid | grep -v grep | awk '{print $$2}')

find:
	nohup npm run find &
killFind:
	kill -9 $(shell ps aux | grep find | grep -v grep | awk '{print $$2}')

change:
	nohup npm run change &
killChange:
	kill -9 $(shell ps aux | grep change | grep -v grep | awk '{print $$2}')

all:
	make bid
	make find
	make change
killAll:
	kill -9 $(shell ps aux | grep node | grep -v grep | awk '{print $$2}')

temp:
	cat /sys/class/thermal/thermal_zone0/temp
