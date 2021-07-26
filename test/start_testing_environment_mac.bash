#!/bin/bash
#
# this script start the S2M testing environment
# it assumes that we have scicat catamel code already on the local machine, a test database running and the proper configuration for catamel.
#
# It starts 2 instances of catamel on port 3001 and port 3002.
# than use the configuration file routing.config.TEST_1, starts S2M on port 3000
#

# loads catamel configuration
source ./test_conf.bash
# find absolute path to catamel
CATAMEL_PATH="$(cd $(dirname ${CATAMEL_PATH}) && pwd)/$(basename ${CATAMEL_PATH})"

# instantiate first instance of catamel
osascript -e "tell app \"Terminal\" to do script \"cd ${CATAMEL_PATH}; PORT=${LISTENING_PORT_1} npm start\""

# instantiate second instance of catamel
osascript -e "tell app \"Terminal\" to do script \"cd ${CATAMEL_PATH}; PORT=${LISTENING_PORT_2} npm start\""

# copy test configuration
cp ./routing.config.TEST_1 ../config/routing.config.json

# start S2M with appropriate configuration
cd ..
npm start

