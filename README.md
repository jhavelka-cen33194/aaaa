[![Test](https://github.com/csas-actions/read-app-metadata/actions/workflows/test.yml/badge.svg)](https://github.com/csas-actions/read-app-metadata/actions/workflows/test.yml)
[![Action Tests](https://github.com/csas-actions/read-app-metadata/actions/workflows/action-tests.yml/badge.svg)](https://github.com/csas-actions/read-app-metadata/actions/workflows/action-tests.yml)
[![Lint](https://github.com/csas-actions/read-app-metadata/actions/workflows/lint.yml/badge.svg)](https://github.com/csas-actions/read-app-metadata/actions/workflows/lint.yml)

# Read Apps Metadata

Read ArgoCD Applications metadata. Supports only Helm charts (no Kustomize), and assumes charts are stored in the
Artifactory.

It reads `.spec.source.helm.values`, but it does not support `.spec.source.helm.parameters`. Use only YAML values
with this action.

## Usage

To report any issue or feature request, open
new [GitHub Issue](https://github.com/csas-actions/read-app-metadata/issues/new/choose).

If you wish to contribute, follow read [Development](#development) section and follow [CONTRIBUTING](./CONTRIBUTING.md)
guidelines.

### Basic Example

This is snippet of direct usage, usually you will use whole deployment workflow, see example below.

```yaml
jobs:
  build:
    runs-on: csas-linux
    steps:
      - name: Checkout
        uses: actions/checkout@v3

      - name: Read metadata
        id: meta
        uses: csas-actions/read-app-metadata@v1
```

### OpenShift 3 Deployment

Here is [reusable workflow](.github/workflows/ocp3-upgrade-apps.yml), that automatically deploys all found applications.
It also shares same inputs as this action.

Prerequisite is, that application is converted to same pipeline and deployment definitions, as OpenShift 4 apps.
See [Java sample app](https://github.com/csas-dev/cicd-samples-java-app-spring-maven) and
its [deployment configuration](https://github.com/csas-ops/cicd-samples-ocp4s-apps/blob/env/dev/java-app-spring-maven.yml)
for details. This workflow is of course limited in its functionality, and does not replace ArgoCD. For example, it
never removes deleted or renamed application deployment.

It depends on properly configured GitHub Environments with `OPENSHIFT_*` secrets.

[:point_right: **How to configure GitHub Environments** :point_left:](./docs/ocp3-environments.md)

Apps repository should follow naming convention `<sas>-ocp3-apps` with configured branch protection,
otherwise manifest won't be picked up by the change bot.

```yaml
name: Deploy

on:
  push:
    branches:
      - env/*
  workflow_dispatch:

jobs:
  deploy:
    name: Deploy
    uses: csas-actions/read-app-metadata/.github/workflows/ocp3-upgrade-apps.yml@v1
    with:
      sas: my-app
      environment: ${{ github.ref_name }}
    secrets:
      ARTIFACTORY_USERNAME: ${{ secrets.ARTIFACTORY_USERNAME }}
      ARTIFACTORY_ACCESS_TOKEN: ${{ secrets.ARTIFACTORY_ACCESS_TOKEN }}
      OPENSHIFT_TOKEN: ${{ secrets.OPENSHIFT_TOKEN }}
      OPENSHIFT_CA: ${{ secrets.OPENSHIFT_CA }}
```

_Note: This workflow needs to be in every branch, not just master (master is actually the only branch where it is not
needed)._

### Inputs

<!--(inputs-start)-->

| Name  | Required | Default | Description |
| :---: | :------: | :-----: | ----------- |
| `dir` | false |  | Root directory, where files are located. Default is current directory. |
| `files` | false |  | Optional glob pattern, a multiline list. |
| `recursive` | false | false | Turns on recursive search of the dir. Unused when files input is used. |

<!--(inputs-end)-->

### Outputs

<!--(outputs-start)-->

| Name  | Description |
| :---: | ----------- |
| `files` | JSON list of found file names. |
| `apps` | JSON list of all parsed metadata. |
| `app` | JSON with single application. Only if exactly one app was found. |
| `file` | File name. Only if exactly one app was found. |
| `name` | Application name. Only if exactly one app was found. |
| `repoURL` | Helm chart repository URL. Only if exactly one app was found. |
| `repoName` | Artifactory repository name. Assumes repoURL points to an Artifactory. Only if exactly one app was found. |
| `chart` | Chart name. Only if exactly one app was found. |
| `version` | Chart version. Only if exactly one app was found. |
| `values` | Helm values, as a string. It will probably contain YAML. Optional. Only if exactly one app was found. |

<!--(outputs-end)-->

## Development

Follow [CONTRIBUTING](./CONTRIBUTING.md) guidelines!

Install the dependencies

```bash
npm install
```

Build the typescript and package it for distribution

```bash
npm run build && npm run package
```

Run the tests

```bash
$ npm test
...

Test Suites: 14 passed, 14 total
Tests:       77 passed, 77 total
Snapshots:   24 passed, 24 total
Time:        4.755 s, estimated 5 s
Ran all test suites.
```

Code must adhere to prettier configuration, and it is checked by eslint. To fix common formatting problems, run

```bash
npm run fix
```

To run build, tests and formatting checks, run

```bash
npm run all
```

Action is tested for every platform and most common cases
in [.github/workflows/action-tests.yml](https://github.com/csas-actions/read-app-metadata/actions/workflows/action-tests.yml)
workflow.

### pre-commit

This action uses [pre-commit](https://pre-commit.com/) hooks, please install it during development, and install hooks
after clone, using

```bash
pre-commit install --install-hooks
```
