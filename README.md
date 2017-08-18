# gcb-docker-compose

`gcb-docker-compose` demonstrates how to run integration tests on Google Cloud
Container Builder (GCB) using `docker-compose`.

This sample application is a simple counter gRPC server with `add`, `reset`,
`get`, and `watch` methods. The application uses [Redis](https://redis.io/) for
storage.

## What is Container Builder?

[Container Builder](https://cloud.google.com/container-builder/) is a Google
Cloud Platform service that uploads your source code and executes your build
in a series of build steps. GCB can produce any artifacts produced by your
application. For example, GCB can create
[Docker container images](https://www.docker.com/) and push them to a private
registry, such as
[Google Container Registry](https://cloud.google.com/container-registry/)

Each build step is run in its container on the same local network. This allows
build steps to communicate with each other and share data.

The ability to communicate and share data between build steps is used in this
example repository: one build step runs the `counter` app and its dependencies
in the background, and another build step runs the integration test steps against
this running stack.

## Understanding the build request

GCB builds are executed using build request files, YAML-formatted configuration
files containing build steps.

The build steps in this example's build request file, `cloudbuild.yaml`, contain
the following instructions:

1. Locate, pull, and install the dependencies necessary to execute the build
1. Run the unit tests
1. Build the Docker image of the `counter` application
1. In the background, start a stack with the newly-built application and its dependencies
1. Run the integration tests against this running stack
1. Push the newly-built and tested image to the registry
