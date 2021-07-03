# ilmo.io

Real-Time Registration Form Generator

## Launch dev env

`docker-compose up --build`

## Create a Form

```
cd schema_examples/
curl -X POST -H "Content-Type: application/json" -d @example.json localhost:5000/api/schema

```
You will get API key at response, you will need it later so keep it safe.

## Get Form results
```
curl -H "Authorization: <API key>" localhost:5000/api/registration/<slug>
```

## Delete Form
```
curl -X DELETE -H "Authorization: <API key>" localhost:5000/api/registration/<slug>
```