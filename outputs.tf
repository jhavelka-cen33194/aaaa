output "object" {
  description = "Output ID's managed by this module."
  value       = var.env_enable_debug || var.enable_debug ? { for tm in local.ghb_files : "${tm.repo}-${tm.branch_name}-${tm.file_dst}" => tm if tm.repo != null } : null
}