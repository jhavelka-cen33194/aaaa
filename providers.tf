terraform {
  required_version = ">= 1.3.3"
  required_providers {
    github = {
      source  = "integrations/github"
      version = "~> 5.29.0"
    }
  }
}