#!/usr/bin/env bash

aws dynamodb create-table \
    --table-name DppTest \
    --attribute-definitions AttributeName=id,AttributeType=N \
    --key-schema AttributeName=id,KeyType=HASH \
    --billing-mode PAY_PER_REQUEST