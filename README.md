<!-- BEGIN_TF_DOCS -->
# Purpose

The module is used for managing files in github repository in csas-dev and
csas-ops organizations. We can manage terraform, FrontEnd and Backed repos.

# Usage

## Integrate this module in your project

### Prepare your project

Typically, these files are located in the root directory of your project.
However, it is not necessarily essential.

#### **main.tf**

```hcl
terraform {
  required_version = ">= 1.3.3"
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 5.29.0"
    }
  }
  backend "azurerm" {
    resource_group_name  = "inet-int-shared-rg"
    storage_account_name = "inetterraformghbintsa01"
    container_name       = "csas-dev-ci-modul-github-files"
    key                  = "terraform.tfstate"
  }
}

module "repo_files" {
  for_each          = module.repo.name
  source          = "artifactory.csin.cz/inet-terraform-local__github/inet-terraform-ghb-modul-github-files/github"
  version         = "1.8.3"
  files           = local.env_secrets_def
  repository_name = each.key
  enable_debug    = var.enable_debug
}
```

#### **providers.tf**

```hcl
provider "github" {
  token = var.csas_inet_dev_token
  owner = "csas-dev"
}
```

#### **variable.tf**

```hcl
variable "enable_debug" {
  default     = true
  description = "Enable/disable output for debugging all repo"
  type        = bool
}

variable "repo_name_for_test_purpose" {
  default     = "inet-terraform-ghb-test"
  description = "Name of repository - only for unit test"
  type        = string
}

variable "csas_inet_dev_token" {
  type        = string
  description = "Token form authentication to github"
  sensitive   = true
}
```

#### **locals_branch_specifics.tf**

```hcl
locals {
  env_secrets_def = {
    inet-terraform-ghb-test = {
      files = { test = {
        #DEV Repos
        #Test Be files
        ".github/workflows/build.yml" = { type_app = "be", src = "files/dev/be/build.yml", helm_chart = "true",
          chart_repo   = "https://artifactory.csin.cz:443/artifactory/inet-helm-local/", image_repo = "artifactory.csin.cz/inet-docker-local",
          java_version = 8, gradle_maven = "gradle"
        }
        ".github/workflows/build-ocp4.yml" = { type_app = "be", src = "files/dev/be/build-ocp4.yml", helm_chart = "true",
          chart_repo   = "https://artifactory.csin.cz:443/artifactory/inet-helm-local/", image_repo = "artifactory.csin.cz/inet-docker-local",
          java_version = 8, gradle_maven = "gradle", branch_name = "dev"
        }
        ".github/workflows/build-ocp4-2.yml" = { type_app = "be", src = "files/dev/be/build-ocp4.yml", helm_chart = "true",
          chart_repo   = "https://artifactory.csin.cz:443/artifactory/inet-helm-local/", image_repo = "artifactory.csin.cz/inet-docker-local",
          java_version = 8, gradle_maven = "gradle"
        }
        ".github/workflows/cleanSnow.yml"              = { type_app = "be", src = "files/ops/cleanSnow.yml", cron_expression = "39 11 * * *" }
        ".github/workflows/setversionOnOps.yml"        = { type_app = "be", src = "files/dev/be/setversionOnOps.yml", ops_repo = "TEST" }
        ".pre-commit-config.yaml"                      = { src = "files/dev/be/.pre-commit-config.yaml" }
        ".github/workflows/pre-commit-checks.yml"      = { src = "files/dev/be/pre-commit-checks.yml" }
        ".github/workflows/pre-commit-checks-ocp4.yml" = { src = "files/dev/be/pre-commit-checks-ocp4.yml" }
        ".github/dependabot.yml"                       = { src = "files/dev/be/dependabot.yml" }
        ".github/release-please.yml"                   = { src = "files/dev/be/release-please.yml" }
        ".github/semantic.yml"                         = { src = "files/semantic.yml" }
        ".gitlint"                                     = { src = "files/.gitlint" }
        ".github/workflows/approve_pr.yml"             = { src = "files/dev/be/approve_pr.yml" }
        ".github/workflows/LAF-build.yml" = { type_app = "be", src = "files/dev/be/LAF/build.yml", helm_chart = "false", java_version = 8,
        ops_repo = "test-repo", label_nahrad = "test-label", laf_app_name = "test-appname" }
        ".LAF-pre-commit-config.yaml"    = { src = "files/dev/be/LAF/.pre-commit-config.yaml" }
        ".github/LAF-dependabot.yml"     = { src = "files/dev/be/LAF/dependabot.yml" }
        ".github/LAF-release-please.yml" = { src = "files/dev/be/LAF/release-please.yml" }
        # Test FE files
        ".github/workflows/main.yml" = { type_app = "fe", src = "files/dev/fe/main.yml", node_version = 14, artifactory_repo_name = "inet-generic-local", src_dir = "dist",
        type = "application", env = "\"int\", \"prs\", \"pred\", \"prod\"", lib = "false" }
        ".github/workflows/premerge_build.yml" = { type_app = "fe", src = "files/dev/fe/premerge_build.yml", node_version = 14,
          artifactory_repo_name = "inet-generic-local", src_dir = "dist", type = "application", env = "deva", lib = "false"
        }
        ".github/workflows/cleanSnow.yml" = { type_app = "fe", src = "files/ops/cleanSnow.yml", cron_expression = "39 11 * * *" }
        ".github/dependabot.yml"          = { src = "files/dev/fe/dependabot.yml" }
        ".github/release-please.yml"      = { src = "files/dev/fe/release-please.yml" }
        ".github/semantic.yml"            = { src = "files/semantic.yml" }
        #Weblogic Pipelines
        ".github/workflows/buildWBL.yml" = { type_app = "be", src = "files/dev/be/LAF/build.yml", helm_chart = "false", java_version = 8,
        ops_repo = "csext-scenarios", label_nahrad = "laf-services" }

        #Test terraform files
        #nasadiem do root repa
        "sonar-project.properties" = { src = "files/dev/terraform/sonar-project.properties", sonar_project = "ghb:dev:inet-terraform-ghb-modul-repositories" }
        ".gitignore"               = { src = "files/dev/terraform/.gitignore" }
        ".gitlint"                 = { src = "files/.gitlint" }
        ".markdownlint.yaml"       = { src = "files/dev/terraform/.markdownlint.yaml" }
        ".pre-commit-config.yaml"  = { src = "files/dev/terraform/.pre-commit-config.yaml" }
        ".terraform-docs.yml"      = { src = "files/dev/terraform/.terraform-docs.yml" }
        ".tflint.hcl"              = { src = "files/dev/terraform/.tflint.hcl" }
        #nasadime do cesty .github/
        ".github/dependabot.yml"     = { src = "files/dev/terraform/dependabot.yml" }
        ".github/release-please.yml" = { src = "files/dev/terraform/release-please.yml" }
        ".github/semantic.yml"       = { src = "files/semantic.yml" }
        #nasadime do cesty .github/workflows
        ".github/workflows/main.yml"                 = { src = "files/dev/terraform/main.yml", module_repo = "inet-terraform-local" }
        ".github/workflows/premerge-validate.yml"    = { src = "files/dev/terraform/premerge-validate.yml" }
        ".github/workflows/create-documentation.yml" = { src = "files/dev/terraform/create-documentation.yml" }

        #OPS repos
        #Test Be files
        ".github/workflows/deploy.yml"                          = { type_app = "be", src = "files/ops/be/deploy.yml", sas = "csint", ops_repo = "csint-apps", laf_app_name = "hypocalcAdmin" }
        ".github/workflows/set_version.yml"                     = { type_app = "be", src = "files/ops/be/set_version.yml" }
        ".github/workflows/approve_PR-OPS.yml"                  = { type_app = "be", src = "files/ops/be/approve_PR-OPS.yml" }
        ".github/workflows/deploy_laf_wls_application.yml"      = { type_app = "be", src = "files/ops/be/LAF/laf_wls_deploy_application.yml" }
        ".github/workflows/setVersion.yml"                      = { type_app = "be", src = "files/ops/be/LAF/setVersion.yml" }
        ".github/workflows/setVersion2.yml"                     = { type_app = "be", src = "files/ops/be/LAF/setVersion.yml", ops_environment = "\"-deva\",\"-edu\",\"-int\",\"-prs\",\"-pred\",\"-prod\"" }
        ".github/workflows/laf_wls_deploy_changed_manifest.yml" = { type_app = "be", src = "files/ops/be/LAF/laf_wls_deploy_changed_manifest.yml" }
        ".github/workflows/push_to_environment.yml"             = { type_app = "be", src = "files/ops/be/LAF/push_to_environment.yml", ops_environment = "\"deva\",\"edu\",\"int\",\"prs\",\"pred\",\"prod\"" }
        ".github/workflows/redeploy_manual.yml"                 = { type_app = "be", src = "files/ops/be/LAF/laf_wls_redeploy_manual.yml" }
        ".github/workflows/validate-k8s.yml"                    = { type_app = "be", src = "files/ops/be/validate-k8s.yml" }
        ".github/workflows/validate.yml"                        = { type_app = "be", src = "files/ops/be/validate.yml", branch_name = "dev" }
        ".github/workflows/validate-2.yml"                      = { type_app = "be", src = "files/ops/be/validate.yml" }
        ".github/workflows/cleanSnow.yml"                       = { type_app = "be", src = "files/ops/cleanSnow.yml", cron_expression = "30 07 * * *" }
        ".github/workflows/main.yml"                            = { type_app = "be", src = "files/ops/main.yml" }
        ".github/workflows/deploy_changed_manifest.yml"         = { type_app = "be", src = "files/ops/deploy_changed_manifest.yml" }
        #Test FE files
        ".github/workflows/deploy-fe.yml"      = { type_app = "fe", src = "files/ops/fe/deploy-fe.yml", artifactory_repo_name = "inet-generic-local", azure_acc = "inet", azure_blob = "cdm", url_dir = "inet" }
        ".github/workflows/deploy-fe-beta.yml" = { type_app = "fe", src = "files/ops/fe/deploy-fe-beta.yml", artifactory_repo_name = "inet-generic-local", azure_acc = "inet", azure_blob = "cdm", url_dir = "inet" }
        }
      }
    }
  }
}
```

## Requirements

| Name | Version |
|------|---------|
| <a name="requirement_terraform"></a> [terraform](#requirement_terraform) | >= 1.3.3 |
| <a name="requirement_github"></a> [github](#requirement_github) | ~> 5.29.0 |

## Resources

| Name | Type |
|------|------|
| [github_repository_file.files](https://registry.terraform.io/providers/integrations/github/latest/docs/resources/repository_file) | resource |

## Modules

No modules.

## Providers

| Name | Version |
|------|---------|
| <a name="provider_github"></a> [github](#provider_github) | ~> 5.29.0 |

## Outputs

| Name | Description |
|------|-------------|
| <a name="output_object"></a> [object](#output_object) | Output ID's managed by this module. |

## Inputs

| Name | Description | Type | Default | Required |
|------|-------------|------|---------|:--------:|
| <a name="input_enable_debug"></a> [enable_debug](#input_enable_debug) | Enable output for debugging all modules | `bool` | n/a | yes |
| <a name="input_files"></a> [files](#input_files) | Object with required settings | `any` | n/a | yes |
| <a name="input_repository_name"></a> [repository_name](#input_repository_name) | Repository name | `any` | n/a | yes |
| <a name="input_env_enable_debug"></a> [env_enable_debug](#input_env_enable_debug) | Enable output only for debug in the module | `bool` | `false` | no |
| <a name="input_pomocna_org"></a> [pomocna_org](#input_pomocna_org) | Recognise which variable have to set in locals.ghb_files in main.tf | `string` | `"dev"` | no |
<!-- END_TF_DOCS -->
