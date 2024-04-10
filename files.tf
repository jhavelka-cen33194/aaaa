resource "github_repository_file" "files" {
  for_each   = { for tm in local.ghb_files : "${tm.repo}-${tm.branch_name}-${tm.file_dst}" => tm }
  repository = each.value.repo
  branch     = each.value.branch_name
  file       = each.value.file_dst
  #pokud je neni nastaven content_fe ci content_be pouzijeme jen obsah file. Jinak nahradime dle FE ci BE
  content             = each.value.content_terraform == null ? each.value.content_fe == null ? each.value.content_be == null ? file(each.value.file_src) : each.value.content_be : each.value.content_fe : each.value.content_terraform
  commit_message      = "chore: Managed files by Terraform"
  commit_author       = "Terraform User"
  commit_email        = "portalysupport@csas.cz"
  overwrite_on_create = true
}


