# Plans

## Set up a dummy node cli tool 

### Acceptance Criteria
* typescript is used
* It accepts one and only one parameter

### Doc
* https://developer.okta.com/blog/2019/06/18/command-line-app-with-nodejs
* https://itnext.io/how-to-create-your-own-typescript-cli-with-node-js-1faf7095ef89 
* https://seenukarthi.com/typescript/2017/11/22/typescript-cmdline-tool/
* https://www.sitepoint.com/javascript-command-line-interface-cli-node-js/
* https://medium.com/getvim/using-node-js-to-write-safer-bash-scripts-ad6a523a5324

## Let the cli parse partiql and output the result to console 


### Test Strategy

* Test fixture:
    * Create a dynamo table
    * Insert tons of records so that pagination will be there
    * The columns in every record should include all kinds of dynamo types
* Test step
    * Run it. Expecting no error and all records are printed

## Set up docker-compose for pg and pgadmin


## Send partiql result to pg


## Dockerise the cli tool

## Try it with real world use case


## Finish off readme