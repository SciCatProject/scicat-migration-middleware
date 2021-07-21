# S2M
# Scicat Migration Middleware

This app is a middleware to transparently migrate scicat from loopback 3 to loopback 4 implementation.
It is designed to login on both backend and according to the configuration direct the user request to the correct backend with the correct authorization token.
User login and logout is done on both backend and the authorization token returned to the user contains both backend authorization tokens separated by the character ~


## Manual testing
At the time of this writing, the test suite has not being created yet.
We have done manual testing using local instances of the backends.
The list below is not completed and it will be updated as we progress with our testing.

If you would like to test this app manually on your local environment, you need to have an instance of scicat lb3 running and also a lb4 one.
Change the configuration in 
Start this middleware and open a terminal where you are going to type the following commands.

### Login
Catamel lb3 has two differnet endpoints for login: one for local user and one for ldap users, which are called by Catanie.  
Frontend Catanie calls first the ldap one and if it fails it tries the local one.  
They can be tested separately with the appropriate user credentials.    

#### Local user login  
This is the curl command to test a local user login. Make sure to insert the correct user and password
```bash 
> curl -i -X POST -H 'Content-type: application/json' -d '{"username": "admin", "password": "xxxxxxxxxxxxxxx"}' http://localhost:3001/api/v3/Users/login
```
If successful, it returns the following headers and body
```bash
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
```

#### Ldap user login
This is the curl command to test a ldap user login. Make sure to insert the correct user and password
```bash
> curl -i -X POST -H 'Content-type: application/json' -d '{"username": "<ldap-user>", "password": "xxxxxxxxxxxxxxxxxx"}' http://localhost:3001/auth/msad`
```

If successful, it will return the following body
```bash
{
  "access_token":"sRBl0feT5ROY7pqFlCs63TSr26EdV1HVw4Anycrk6H5DdvpEw1E7mIIJ5ctDSM9V~<no-lb4-backend>",
  "userId":"5ca1d68cef0c3a00092672da"
}
```

### List all datasets
To obtain the list of all datasets, you can use any of the following two curl commands.  
They behave exactly the same. The only difference is that the authorization token is provided in the header or as a query parameter  
```bash
> curl -i -X GET -H 'Authorization: "sRBl0feT5ROY7pqFlCs63TSr26EdV1HVw4Anycrk6H5DdvpEw1E7mIIJ5ctDSM9V~<no-lb4-backend>"' http://localhost:3001/api/v3/Datasets

> curl -i -X GET -H 'Accept: application/json' 'http://localhost:3001/api/v3/Datasets?access_token=sRBl0feT5ROY7pqFlCs63TSr26EdV1HVw4Anycrk6H5DdvpEw1E7mIIJ5ctDSM9V~<no-lb4-backend>
```

### Retrieve a specific dataset
To retrieve a specific dataset, use the following curl dataset.
```bash
> curl -X GET --header 'Accept: application/json' 'http://localhost:3000/api/v3/Datasets/20.500.12269%2F0052f856-9615-4f9a-8575-9e180071ff32?access_token=TLx5gJT2krqoYO6UvozHxxoLfVLsdCyjC6s8NhzB81LjGwXfHirjlwQyTvVWTEd6'
```


