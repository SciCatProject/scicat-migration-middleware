# S2M
## Scicat Migration Middleware


### manual test

- local user
`curl -i -X POST -H 'Content-type: application/json' -d '{"username": "admin", "password": "xxxxxxxxxxxxxxx"}' http://localhost:3001/api/v3/Users/login`

- ldap user
`curl -i -X POST -H 'Content-type: application/json' -d '{"username": "<ldap-user>", "password": "xxxxxxxxxxxxxxxxxx"}' http://localhost:3001/auth/msad`

