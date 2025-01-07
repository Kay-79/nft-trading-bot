bid:
	nohup bun bid > /dev/null 2>&1 &

killBid:
	kill -9 $(shell ps aux | grep bid | grep -v grep | awk '{print $$2}')

find:
	nohup bun find > /dev/null 2>&1 &

killFind:
	kill -9 $(shell ps aux | grep find | grep -v grep | awk '{print $$2}')

change:
	nohup npm run change > /dev/null 2>&1 &

killChange:
	kill -9 $(shell ps aux | grep change | grep -v grep | awk '{print $$2}')

killApiMomo:
	if [ -f apiMomo.pid ]; then \
		kill -9 $$(cat apiMomo.pid) && rm -f apiMomo.pid; \
	else \
		echo "apiMomo PID file not found."; \
	fi

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


temp:
	cat /sys/class/thermal/thermal_zone0/temp

deploy:
	npx hardhat run scripts/deploy.ts --network bsc

deployToken:
	npx hardhat run scripts/deployToken.ts --network bsc

deployUpgrade:
	npx hardhat run scripts/deployUpgrade.ts --network bsc

check:
	npm run check

create:
	npm run create


modelAI:
	python ./src/AI/model/model.py

modelAIPi:
	bash -c "source venv/bin/activate && python ./src/AI/model/modelPi.py"

# apiMomo:
# 	bash -c "source venv/bin/activate && nohup python ./src/AI/api/app.py > /dev/null 2>&1 &"

apiMomo:
	bash -c "source venv/bin/activate && nohup python ./src/AI/api/app.py > /dev/null 2>&1 & echo $$! > apiMomo.pid"

apiMomoWin:
	.\venv\Scripts\activate
	python ./src/AI/api/app.py

moveSsh:
	scp /Users/legend_k/Downloads/datasets.json kaybot@172.16.1.111:/home/kaybot/Desktop/be-mobox-front-run/src/AI/data