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