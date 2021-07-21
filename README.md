# S2M
## Scicat Migration Middleware


### manual test

#### login
- local user
`curl -i -X POST -H 'Content-type: application/json' -d '{"username": "admin", "password": "xxxxxxxxxxxxxxx"}' http://localhost:3001/api/v3/Users/login`

curl -i -X POST -H 'Content-type: application/json' -d '{"username": "admin", "password": "veIKtDrHHqlDEZL51bbpo2XCDYvcMmu"}' http://localhost:3001/api/v3/Users/login
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 177
ETag: W/"b1-Bj1s71GsH3xucjLshv7eFI9Jcz4"
Date: Wed, 21 Jul 2021 12:06:57 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id":"sRBl0feT5ROY7pqFlCs63TSr26EdV1HVw4Anycrk6H5DdvpEw1E7mIIJ5ctDSM9V~<no-lb4-backend>",
  "ttl":1209600,
  "created":"2021-07-21T12:06:57.160Z",
  "userId":"5ca1d68cef0c3a00092672da"
}



- ldap user
`curl -i -X POST -H 'Content-type: application/json' -d '{"username": "<ldap-user>", "password": "xxxxxxxxxxxxxxxxxx"}' http://localhost:3001/auth/msad`


#### get datasets list

`curl -i -X GET -H 'Authorization: "sRBl0feT5ROY7pqFlCs63TSr26EdV1HVw4Anycrk6H5DdvpEw1E7mIIJ5ctDSM9V~<no-lb4-backend>"' http://localhost:3001/api/v3/Datasets`

`curl -i -X GET -H 'Accept: application/json' 'http://localhost:3001/api/v3/Datasets?access_token=sRBl0feT5ROY7pqFlCs63TSr26EdV1HVw4Anycrk6H5DdvpEw1E7mIIJ5ctDSM9V~<no-lb4-backend>`


#### get a dataset

`curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/v3/Datasets/20.500.12269%2F0052f856-9615-4f9a-8575-9e180071ff32?access_token=TLx5gJT2krqoYO6UvozHxxoLfVLsdCyjC6s8NhzB81LjGwXfHirjlwQyTvVWTEd6'`


