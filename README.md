# dynamo-partiql-result-in-pg
A command-line tool to run SQL(PartiQL) against DynamoDB and save result in out-of-box Postgres. Zero config.


# How to use

## Pre-requisites
* AWS CLI (configured)
* Docker


## Run it

* Start up Postgres and pgAdmin
```bash
docker-compose up
```

* Run PartiQL 
```
./dpp "select * from ... "
```
(Windows user please run the docker command in file ./dpp)


You will see

```
The results are in postgres table 'xxx'
```

Then go to [pgAdmin](http://localhost:21086) to query the table

Todo: some screenshot 

* Shutdown Postgres (if needed)
```bash
docker-compose down
```





# For developers

### Set up test table

The table should
* Be big enough so that "NextToken" can be tested
* Contain [all data types](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html) of DynamoDB

To make this happen,
```
cd ./doc/test

./create-test-table.sh
./put-test-items.js

```

After your testing,  clean up

```
./delete-test-table.sh
```