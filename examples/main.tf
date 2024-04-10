terraform {
  required_version = ">= 1.3.3"
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 6.2.1"
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
  // only for Unit test
  // In real usage uncomment 3 rows bellow and comment out these 2 lines:
  //    for_each = local.tmp_value
  //    source   = "../"
  //for_each          = module.repo.name
  //source          = "artifactory.csin.cz/inet-terraform-local__github/inet-terraform-ghb-modul-github-files/github"
  //version         = "1.8.3" // x-release-please-version
  for_each        = local.tmp_value
  source          = "../"
  files           = local.env_secrets_def
  repository_name = each.key
  enable_debug    = var.enable_debug
}
