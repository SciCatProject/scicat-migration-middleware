#!/bin/bash
#
# 
# this script is mac OS X only
# it starts a new terminal and runs an instance of catamel on the specified port specified.
#
# please check the run_test_environment.bash on how the different components are run
# if you have the components in non standard locations 
# or you want to change the ports where catamel instances are run, 
# please modify the file test_conf.bash
#
#
# this script has to be run as it follow:
# ./ run_catamel_instance_mac.bash PATH_TO_CATAMEL LISTENING_PORT
#

# reads input arguments
PATH_TO_CATAMEL=$1
LISTENING_PORT=$2

# prepare command
CMD="bash -c \"cd ${PATH_TO_CATAMEL}; PORT=${LISTENING_PORT} npm start\""

# start instance
echo "Input arguments:"
echo " - path to catamel : ${PATH_TO_CATAMEL}"
echo " - listening port  : ${LISTENING_PORT}"
echo ""
echo "Starting catamel with the following command:"
echo $CMD
echo ""
osascript -e "tell app \"Terminal\" to do script \"${CMD}\"'
