# gcb-docker-compose

Example on how to run integration tests on Google Container Builder, using
docker-compose.

## What is Google Cloud Container Builder (GCB)?

The container builder service takes your source and turns it into whatever you
want, in a serie of steps. Especially docker images.

Each step is run in its container, which are on a same docker network. This is
an important detail, because that means the running step containers can talk
to each other.

This property is used in this example: one step runs the `counter` app and its
dependencies in the background, and another step runs the integration steps
against this running stack.

## The application

This application is a simple counter grpc server (with `add`, `reset`,
`get` and `watch` methods) using [Redis](https://redis.io/) as the storage.

## The Cloud Build configuration

The GCB configuration file, `cloudbuild.yaml`, contains the different steps to
run during build:
1. Install the dependencies
1. Run the unit tests
1. Build the docker image of the counter application
1. Start a stack with the newly built application and its dependencies, in the
background
1. Run the integration tests against this running stack
1. Push the new built and tested image to the registry
