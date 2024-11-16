bid:
	nohup bun bidV2 &

killBid:
	kill -9 $(shell ps aux | grep bidV2 | grep -v grep | awk '{print $$2}')

find:
	nohup bun findV2 &

killFind:
	kill -9 $(shell ps aux | grep findV2 | grep -v grep | awk '{print $$2}')

change:
	nohup npm run change &

killChange:
	kill -9 $(shell ps aux | grep change | grep -v grep | awk '{print $$2}')

all:
	make bid
	make find
	make change

allWin:
	npm run bid
	npm run find
	npm run change

killAll:
	kill -9 $(shell ps aux | grep node | grep -v grep | awk '{print $$2}')

temp:
	cat /sys/class/thermal/thermal_zone0/temp

deploy:
	npx hardhat run scripts/deploy.ts --network bsc