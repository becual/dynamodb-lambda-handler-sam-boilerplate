#!/bin/bash
set -e;

docker network create -d bridge --subnet 111.10.0.0/24 --gateway 111.10.0.1 example_network 2>&1 >/dev/null || true

aws dynamodb delete-table --table-name dev.example.parameters --endpoint-url http://localhost:8000 2>&1 >/dev/null || true

aws dynamodb create-table --cli-input-json file://scripts/dev.example.parameters.json --endpoint-url http://localhost:8000 2>&1 >/dev/null || true