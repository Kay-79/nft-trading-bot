############### BOT ###############
bid:
	nohup bun bid > /dev/null 2>&1 &

killBid:
	kill -9 $(shell ps aux | grep bid | grep -v grep | awk '{print $$2}')

find:
	nohup bun find > /dev/null 2>&1 &

killFind:
	kill -9 $(shell ps aux | grep find | grep -v grep | awk '{print $$2}')

change:
	nohup bun change > /dev/null 2>&1 &

killChange:
	kill -9 $(shell ps aux | grep change | grep -v grep | awk '{print $$2}')

killApiMomo:
	kill -9 $(shell ps aux | grep app.py | grep -v grep | awk '{print $$2}')

all:
	make bid
	make find
	make change
	make apiMomo

allWin:
	npm run bid
	npm run find
	npm run change

killAll:
	kill -9 $(shell ps aux | grep bun | grep -v grep | awk '{print $$2}')
	kill -9 $(shell ps aux | grep node | grep -v grep | awk '{print $$2}')
	make killApiMomo
#######################################
############### HARDHAT ###############
deployBid:
	npx hardhat run scripts/deployBid.ts --network bsc

deployToken:
	npx hardhat run scripts/deployToken.ts --network bsc

deployBidUpgrade:
	npx hardhat run scripts/deployBidUpgrade.ts --network bsc
#######################################
############### TEST ##################
check:
	npm run check

create:
	npm run create
#######################################
############### AI ####################
hostDb:
	bun ./src/AI/api/hostDb.ts

getDbBox:
	bun ./src/AI/data/getDbBox.ts
	bun clean

getDbBot:
	bun ./src/AI/data/getDbBot.ts
	bun clean

modelAI:
	python ./src/AI/model/model.py

modelAIPi:
	bash -c "source venv/bin/activate && python ./src/AI/model/model.py"
#######################################
############### API ###################
apiMomo:
	bash -c "source venv/bin/activate && nohup python ./src/AI/api/app.py > /dev/null 2>&1 &"

apiMomoWin:
	.\venv\Scripts\activate
	python ./src/AI/api/app.py
#######################################
############### PLA-PLA ###############
moveSsh:
	scp /Users/legend_k/Downloads/datasets.json kaybot@172.16.1.111:/home/kaybot/Desktop/be-mobox-front-run/src/AI/data

temp:
	cat /sys/class/thermal/thermal_zone0/temp