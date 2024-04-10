variable "files" {
  description = "Object with required settings"
}

variable "repository_name" {
  description = "Repository name"
}

variable "env_enable_debug" {
  default     = false
  description = "Enable output only for debug in the module"
  type        = bool
}

variable "enable_debug" {
  description = "Enable output for debugging all modules"
  type        = bool
}

variable "pomocna_org" {
  description = "Recognise which variable have to set in locals.ghb_files in main.tf"
  type        = string
  default     = "dev"
}