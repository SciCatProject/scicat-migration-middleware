# S2M
# Scicat Migration Middleware

This app is a middleware to transparently migrate scicat from loopback 3 to loopback 4 implementation.
It is designed to login on both backend and according to the configuration direct the user request to the correct backend with the correct authorization token.
User login and logout is done on both backend and the authorization token returned to the user contains both backend authorization tokens separated by the character ~


## Manual testing
At the time of this writing, the test suite has not being created yet. WE are not sure if we are not going to ever create it.
We have done manual testing using local instances of the backends.

The test folder contains a bash script which spin up two instances of catamel on different ports but sharing the same database.
Once the two backends are running, S2M will be started with the the test configuration config/routing.config.TEST_1.
At this point, user can manually test that S2M can distribute requests according to the configuration, which should be matching the following schema:
- Proposals -> backend running on port 3002
- all other requests -> backend running on port 3001

S2M should run on port 3000, so catanie can run with the default configuration.

Test can be done manually using ther curl command in a  terminal or using scicat frontend catanie.
The file test_commands.md contains all teh tests that have been run duirng our testing, together with the results.


