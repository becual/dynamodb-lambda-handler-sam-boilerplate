# Dynamodb Lambda handler SAM Boilerplate with NodeJS

El siguiente repositorio tiene por objetivo servir como boilerplate que permita probar de forma locar una lambda y una base de datos DynamoDB.

## Pre requisitos

- SAM CLI
- AWS CLI
- yarn

## Consideraciones del boilerplate

El boilerplate es capaz de ejecutar test unitarios y de integracion con una base de datos DynamoDB sin mas configuración que ejecutar `yarn` o `npm install`.

Ejecución de los test unitarios:

- `yarn test`: Corre los test y despliega informe de **nyc**
  - Levanta el contenedor de DynamoDB
  - Configura el docker network
  - Elimina, si existe, la tabla de DynamoDB a ocupar
  - Crea la tabla de DynamoDB a ocupar
  - Corre los test con AVA

- `yarn test:watch`: Corre los test cada vez que el codigo cambia.
  - Levanta el contenedor de DynamoDB
  - Configura el docker network
  - Elimina, si existe, la tabla de DynamoDB a ocupar
  - Crea la tabla de DynamoDB a ocupar
  - Corre los test con AVA

Ejecución del test de integración:

- `test:integration`
  - Levanta el contenedor de DynamoDB
  - Configura el docker network
  - Elimina, si existe, la tabla de DynamoDB a ocupar
  - Crea la tabla de DynamoDB a ocupar
  - Levanta el contenedor docker ocupando el comando `sam local invoke` para que ejecute la lambda de forma local y le pasa el archivo [event.json](event.json) como evento de entrada.


### Docker network

Para poder probar de forma local la Lambda con DynamoDB, primero debe levantarse un contenedor docker que corre DynamoDB ocupando la imagen docker ***amazon/dynamodb-local*** que se encuentra configurado en el archivo [docker-compose.yml](docker-compose.yml). Este archivo de definicion de docker-compose exporta el puerto 8000 que es el que por defecto ocupa DynamoDB para que sea accesible desde la máquina host.

Cuando se corre la lambda de forma local para probar su funcionamiento con el comando `sam local invoke`, se levanta una imagen docker. Para conectarse a la base DynamoDB que corre de forma local deberia saber la direccion IP de la maquina host, pero como no hay forma que dinamicamente la sepa. La solución es crear un [docker network](https://docs.docker.com/network/) de tipo bridge que permita a los contenedores que pertenescan a esta red acceder mediante un gateway fijo a los recursos de la maquina host. El comando para crear esta red es:

 `docker network create -d bridge --subnet 111.10.0.0/24 --gateway 111.10.0.1 example_network`.

El siguiente paso es ejecutar la lambda local incluyendo en el parametro *--docker-network* junto al nombre de la red que acabamos de crear:

`sam local invoke --docker-network example_network`

El archivo [setup.sh](scripts/setup.sh) se encarga de crear el docker network y la tabla de DynamoDB.


## Continuará....
README.md incompleto, estamos trabajando para usted.