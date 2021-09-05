# DynamoDB Partiql result in Postgres
A command-line tool to run SQL(PartiQL) against DynamoDB and save result in out-of-box Postgres. Zero config.


# How to use

## Pre-requisites
* AWS CLI (configured)
* Node

## Install 

Clone this repo, then

```
npm install
npm run clean
npm run build
```

If new features of this tool are available, run `git pull` and run the commands above again


## Run

### Start up Postgres and pgAdmin
```bash
docker-compose up
```

Go to [pgAdmin](http://localhost:21086) . You should see a pre-imported Postgres server (password: `dpp`)


### Run the tool
```
./dpp "select * from ... "
```
*(If are a windows user, take a look at file `./dpp` and you'll know how to run it in Windows)*


From the console output you will see the table name for this run, e.g. `t_1630152784804`


### Analyse the data in Postgres

Go to [pgAdmin](http://localhost:21086)
```
select * from t_1630152784804 where ...
```

## Advanced Usage

### Load PartiQL result file to Postgres

After PartiQL is run using `./dpp`, the result will be saved as a temp json file. 

You can load this file into Postgres without re-running `./dpp` again

```
./dpp-load /var/folders/k5/3jjw_my51_gcdm7bmt783b480000gn/T/dpp-items--18473-j2SzClrvSH09-.json
```



# For developers

## Do a manual test

### Create a test table

The table should
* Be big enough so that "NextToken" can be tested
* Contain [all data types](https://docs.aws.amazon.com/amazondynamodb/latest/APIReference/API_AttributeValue.html) of DynamoDB

To make this happen,
```
./doc/test/create-test-table.sh
./doc/test/put-test-items.js
```

### Run the program against the new table

```
./dpp "select * from DppTest"
```

### Clean up

```
./doc/test/delete-test-table.sh
```
