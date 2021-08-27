# dynamo-partiql-result-in-pg
A command-line tool to run SQL(PartiQL) against DynamoDB and save result in out-of-box Postgres. Zero config.


# How to use

## Pre-requisites
* AWS Credentials Configured
  * If you don't know what it means, just install AWS CLI and configure it (TODO: link)
* Docker


## Run it

* Start up Postgres and pgAdmin
```bash
docker-compose up
```

* Run PartiQL 
```
./dpp "select * from \"my-dynamo-table\" where ... "
```
(Windows user please run the docker command in file ./dpp)


You will see

```
The results are in postgres table `my-dynamo-table-xxx`
```

Then go to [pgAdmin](http://localhost:21086) to query the table

Todo: some screenshot 

* Shutdown Postgres (if needed)
```bash
docker-compose down
```