#### Local user login  
Login with a local functional user.
```bash 
> curl -i -X POST -H 'Content-type: application/json' -d '{"username": "admin", "password": "xxxxxxxxxxxxxxx"}' http://localhost:3000/api/v3/Users/login
```
If successful, it returns the following headers and body
```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 225
ETag: W/"b1-Bj1s71GsH3xucjLshv7eFI9Jcz4"
Date: Mon, 26 Jul 2021 11:40:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "id" : "y1M6CDZDAqxaKRmUiQylCMZ5cFx8Tn0VxnYNxcFH95iUNzqbXyufFPoa9DSm5JHB~DCwDgdyhS2zQmGA8tsjs8tIXDYTkB4QCwZmZzwN3E8K53OxYasY2vccFIuvJvcE6",
  "ttl" : 1209600,
  "created" : "2021-07-26T11:39:30.491Z",
  "userId" : "5ca1d68cef0c3a00092672da"
}
```

#### User logout
Logout local user
```bash
> curl -i -X GET -H 'Authorization: "y1M6CDZDAqxaKRmUiQylCMZ5cFx8Tn0VxnYNxcFH95iUNzqbXyufFPoa9DSm5JHB~DCwDgdyhS2zQmGA8tsjs8tIXDYTkB4QCwZmZzwN3E8K53OxYasY2vccFIuvJvcE6"' http://localhost:3001/api/v3/User/logout
```
If the logout is successful, the response will be a 204
```
HTTP/1.1 204 No Content
X-Powered-By: Express
ETag: W/"11-kEXJrBnjX4DIMUpp+x/XDbhFevo"
Date: Mon, 26 Jul 2021 13:00:58 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```
If an error accours, it will return 501
```
HTTP/1.1 501 Not Implemented
X-Powered-By: Express
Content-Type: text/html; charset=utf-8
Content-Length: 98
ETag: W/"62-I0FYvEz5EOyjNeE3D+TFVi2caTM"
Date: Mon, 26 Jul 2021 13:02:15 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "statusCode":501,
  "name":"Error",
  "message":"Internal Server Error",
  "code":"INTERNAL_SERVER_ERROR"
}
```

#### Ldap user login
This is the curl command to test a ldap user login. Make sure to insert the correct user and password
```bash
> curl -i -X POST -H 'Content-type: application/json' -d '{"username": "<ldap-user>", "password": "xxxxxxxxxxxxxxxxxx"}' http://localhost:3000/auth/msad`
```
If successful, it will return the following body
```bash
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 184
ETag: W/"b8-JEKexehqIxAaC/6sS8nCYe92nwM"
Date: Mon, 26 Jul 2021 13:36:06 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{
  "access_token":"CPh1xqepa6qNCNVhwLmJqXARcHE3SFjMJc7HKkiCyzfqQfCwjhaFVCkyyIi2ACx4~XZw6TAO7NbgJX7BEnXpxl0cd66itdzgLLZL3RocbDXJKJ2sc1FxZMDd49RMlzhvm",
  "userId":"60784f6d6f88b06bbee53817"
}
```

#### ldap user logut
```
curl -i -X POST -H 'Authorization: CPh1xqepa6qNCNVhwLmJqXARcHE3SFjMJc7HKkiCyzfqQfCwjhaFVCkyyIi2ACx4~XZw6TAO7NbgJX7BEnXpxl0cd66itdzgLLZL3RocbDXJKJ2sc1FxZMDd49RMlzhvm' http://localhost:3000/api/v3/Users/logout
```

Successful logout will result in the following response
```
HTTP/1.1 204 No Content
X-Powered-By: Express
ETag: W/"11-kEXJrBnjX4DIMUpp+x/XDbhFevo"
Date: Mon, 26 Jul 2021 13:36:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### List all datasets
To obtain the list of all datasets, you can use any of the following two curl commands.  
They behave exactly the same. The only difference is that the authorization token is provided in the header or as a query parameter  
```bash
> curl -i -X GET -H 'Authorization: CPh1xqepa6qNCNVhwLmJqXARcHE3SFjMJc7HKkiCyzfqQfCwjhaFVCkyyIi2ACx4~XZw6TAO7NbgJX7BEnXpxl0cd66itdzgLLZL3RocbDXJKJ2sc1FxZMDd49RMlzhvm' http://localhost:3001/api/v3/Datasets
```

If successful, this is the response that you should get:
```
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 12197507
ETag: W/"ba1e83-G7n9mSAXeB5nyyjYORZ+BBqAruk"
Date: Mon, 26 Jul 2021 13:43:41 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"pid":"20.500.12269/0052f856-9615-4f9a-8575-9e180071ff32","owner":"Oliver Lohmann","orcidOfOwner":"default","contactEmail":"oliver.lohmann@esss.se","sourceFolder":"/nfs/groups/beamlines/v20/14CD3N","size":195221294,"packedSize":195221294,"numberOfFiles":1,"creationTime":"2019-08-02T12:03:28.000Z","type":"raw","validationStatus":"string","keywords":["v20","neutron"],"description":"V20 data","datasetName":"Open beam WFM Slits 0.2x25","classifi...
```
In S2M logs, this request should has been routed to http://localhost:3001/api/v3/Datasets



### Retrieve a specific dataset
The following example retrieve a single dataset by its id. The response is successful and returns the scicat entry.
```bash
> curl -i -X GET -H 'Authorization: CMG8Fx5etlrWhOOA9WHcyAiy3ZPHmEuRrwhbgBoUtnXYawPZFvB0YoyDKolGNo56~BQnRFtTa9QFgnOGzH453Jf7pPWV0kGAPjYU9d0nYFWqZNbDKo9GAPJKjIiH1XAWl' http://localhost:3000/api/v3/Datasets/20.500.12269%2F0052f856-9615-4f9a-8575-9e180071ff32
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 3997
ETag: W/"f9d-kexxkdL6o1ywjYCw7hYkCQdVx+s"
Date: Mon, 26 Jul 2021 13:48:49 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"pid":"20.500.12269/0052f856-9615-4f9a-8575-9e180071ff32","owner":"Oliver Lohmann","orcidOfOwner":"default","contactEmail":"oliver.lohmann@esss.se","sourceFolder":"/nfs/groups/beamlines/v20/14CD3N","size":195221294,"packedSize":195221294,"numberOfFiles":1,"creationTime":"2019-08-02T12:03:28.000Z","type":"raw","validationStatus":"string","keywords":["v20","neutron"],"description":"V20 data","datasetName":"Open beam WFM Slits 0.2x25","classification":"AV=medium,CO=low","license":"CC-BY-4.0","version":"3.0.1","isPublished":true,"ownerGroup":"ess","accessGroups":["ess","brightness"],"createdBy":"ingestor","updatedBy":"anonymous","history":[{"id":"571340c7-b613-450e-a46e-379010b8f0c5","scientificMetadata":{"currentValue":{"start_time":{"value":"2019-08-02T12:03:28","unit":""},"file_name":{"value":"/data/kafka-to-nexus/nicos_00000482.hdf","unit":""},"title":{"value":"Open beam WFM Slits 0.2x25","unit":""},"size":{"value":0,"unit":""},"chopper_1_speed":{"value":0,"unit":"hertz","valueSI":0,"unitSI":"s^-1"},"chopper_1_phase":{"value":0,"unit":"deg","valueSI":0,"unitSI":"rad"},"chopper_2_phase":{"value":0,"unit":"deg","valueSI":0,"unitSI":"rad"},"chopper_2_speed":{"value":0,"unit":"hertz","valueSI":0,"unitSI":"s^-1"},"chopper_3_phase":{"value":0,"unit":"deg","valueSI":0,"unitSI":"rad"},"chopper_3_speed":{"value":0,"unit":"hertz","valueSI":0,"unitSI":"s^-1"},"chopper_4_phase":{"value":0,"unit":"deg","valueSI":0,"unitSI":"rad"},"chopper_4_speed":{"value":0,"unit":"hertz","valueSI":0,"unitSI":"s^-1"},"sample_description":{"value":"","unit":""},"sample_temperature":{"value":0,"unit":"celsius","valueSI":273.15,"unitSI":"K"}},"previousValue":{"start_time":{"value":"2019-08-02T12:03:28","unit":""},"file_name":{"value":"/data/kafka-to-nexus/nicos_00000482.hdf","unit":""},"title":{"value":"Open beam WFM Slits 0.2x25","unit":""},"size":{"value":0,"unit":""},"chopper_1_speed":{"value":0,"unit":"hertz"},"chopper_1_phase":{"value":0,"unit":"deg"},"chopper_2_phase":{"value":0,"unit":"deg"},"chopper_2_speed":{"value":0,"unit":"hertz"},"chopper_3_phase":{"value":0,"unit":"deg"},"chopper_3_speed":{"value":0,"unit":"hertz"},"chopper_4_phase":{"value":0,"unit":"deg"},"chopper_4_speed":{"value":0,"unit":"hertz"},"sample_description":{"value":"","unit":""},"sample_temperature":{"value":0,"unit":"celsius"}}},"updatedBy":"anonymous","updatedAt":"2021-02-15T12:47:38.515Z"}],"datasetlifecycle":{"archivable":true,"retrievable":false,"publishable":true,"dateOfDiskPurging":"2029-08-02T10:03:28.000Z","archiveRetentionTime":"2029-08-02T10:03:28.000Z","dateOfPublishing":"2032-08-02T10:03:28.000Z","isOnCentralDisk":true,"archiveStatusMessage":"string","retrieveStatusMessage":"string","archiveReturnMessage":{},"retrieveReturnMessage":{},"exportedTo":"string","retrieveIntegrityCheck":true},"createdAt":"2019-09-04T11:11:46.890Z","updatedAt":"2021-02-15T12:47:56.771Z","techniques":[],"principalInvestigator":"Oliver Lohmann","endTime":"2019-08-02T12:03:28","creationLocation":"V20","dataFormat":"NeXus HDF5","scientificMetadata":{"start_time":{"value":"2019-08-02T12:03:28","unit":""},"file_name":{"value":"/data/kafka-to-nexus/nicos_00000482.hdf","unit":""},"title":{"value":"Open beam WFM Slits 0.2x25","unit":""},"size":{"value":0,"unit":""},"chopper_1_speed":{"value":0,"unit":"hertz","valueSI":0,"unitSI":"s^-1"},"chopper_1_phase":{"value":0,"unit":"deg","valueSI":0,"unitSI":"rad"},"chopper_2_phase":{"value":0,"unit":"deg","valueSI":0,"unitSI":"rad"},"chopper_2_speed":{"value":0,"unit":"hertz","valueSI":0,"unitSI":"s^-1"},"chopper_3_phase":{"value":0,"unit":"deg","valueSI":0,"unitSI":"rad"},"chopper_3_speed":{"value":0,"unit":"hertz","valueSI":0,"unitSI":"s^-1"},"chopper_4_phase":{"value":0,"unit":"deg","valueSI":0,"unitSI":"rad"},"chopper_4_speed":{"value":0,"unit":"hertz","valueSI":0,"unitSI":"s^-1"},"sample_description":{"value":"","unit":""},"sample_temperature":{"value":0,"unit":"celsius","valueSI":273.15,"unitSI":"K"}},"sampleId":"gjMbxD3lVa","proposalId":"14CD3N"}
```

The S2M logs should contains the following entry indicating that the request has been routed to first backend listeing on port 3001:
```bash
Endpoint requested : /Datasets/20.500.12269%2F0052f856-9615-4f9a-8575-9e180071ff32
No user routing for endpoint : /Datasets/20.500.12269%2F0052f856-9615-4f9a-8575-9e180071ff32
Endpoint requested : /Datasets/20.500.12269%2F0052f856-9615-4f9a-8575-9e180071ff32
Routing request to : http://localhost:3001/api/v3/Datasets/20.500.12269%2F0052f856-9615-4f9a-8575-9e180071ff32
```

#### List all proposals
The following block shows the command to retrieve all the proposals. The configuration instruct S2M to forward the request to the backend running on port 3002
```bash
> curl -i -X GET -H 'Authorization: CMG8Fx5etlrWhOOA9WHcyAiy3ZPHmEuRrwhbgBoUtnXYawPZFvB0YoyDKolGNo56~BQnRFtTa9QFgnOGzH453Jf7pPWV0kGAPjYU9d0nYFWqZNbDKo9GAPJKjIiH1XAWl' http://localhost:3000/api/v3/proposals

HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 15948
ETag: W/"3e4c-pwIxTpMAP/Z124t2TJWkJp67URc"
Date: Mon, 26 Jul 2021 13:56:48 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"proposalId":"14CD3N","pi_email":"oliver.lohmann@esss.se","pi_firstname":"Oliver","pi_lastname":"Lohmann","email":"oliver.lohmann@esss.se","firstname":"Oliver","lastname":"Lohmann","title":"SANS/Reflectometry","abstract":"SANS/Reflectometry","startTime":"2019-07-29T01:01:00.000Z","endTime":"2019-09-01T23:59:00.000Z","ownerGroup":"ess","accessGroups":["ess"],"createdBy":"ingestor","updatedBy":"proposalIngestor",...
```

In S2M logs the following entry confirms that the request has been routed to catamel instsance listening on port 3002
```
Endpoint requested : /proposals
Routing request to : http://localhost:3002/api/v3/proposals
```

#### Retrieve a single proposal
The request to retrieve a single proposal should be also redirected to catamel listening on port 3002. This is the request and response entered and received on the console:
```bash
curl -i -X GET -H 'Authorization: CMG8Fx5etlrWhOOA9WHcyAiy3ZPHmEuRrwhbgBoUtnXYawPZFvB0YoyDKolGNo56~BQnRFtTa9QFgnOGzH453Jf7pPWV0kGAPjYU9d0nYFWqZNbDKo9GAPJKjIiH1XAWl' http://localhost:3000/api/v3/proposals/14CD3N
HTTP/1.1 200 OK
X-Powered-By: Express
Content-Type: application/json; charset=utf-8
Content-Length: 680
ETag: W/"2a8-lZASCDoIi7daBFQSvKBpI0phlMI"
Date: Mon, 26 Jul 2021 14:02:25 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"proposalId":"14CD3N","pi_email":"oliver.lohmann@esss.se","pi_firstname":"Oliver","pi_lastname":"Lohmann","email":"oliver.lohmann@esss.se","firstname":"Oliver","lastname":"Lohmann","title":"SANS/Reflectometry","abstract":"SANS/Reflectometry","startTime":"2019-07-29T01:01:00.000Z","endTime":"2019-09-01T23:59:00.000Z","ownerGroup":"ess","accessGroups":["ess"],"createdBy":"ingestor","updatedBy":"proposalIngestor","MeasurementPeriodList":[{"id":"string","instrument":"V20","start":"2019-07-29T01:01:00.000Z","end":"2019-09-01T23:59:00.000Z","comment":"string","createdAt":"2021-07-26T14:02:25.281Z"}],"createdAt":"2019-06-24T11:55:58.798Z","updatedAt":"2019-06-24T11:56:27.443Z"}
```

S2M logs shows the followling lines:
```bash
Endpoint requested : /proposals/14CD3N
No user routing for endpoint : /proposals/14CD3N
Endpoint requested : /proposals/14CD3N
Routing request to : http://localhost:3002/api/v3/proposals/14CD3N
```





