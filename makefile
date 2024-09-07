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

killAll:
	kill -9 $(shell ps aux | grep node | grep -v grep | awk '{print $$2}')