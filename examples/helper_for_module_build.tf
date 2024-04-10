locals {
  //It's need only for unit test of this module
  //In real usage we have module repo, which set the value
  tmp_value = toset([var.repo_name_for_test_purpose])
}