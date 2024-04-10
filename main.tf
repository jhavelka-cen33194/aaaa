locals {
  ghb_files = flatten([
    for repos, files in var.files : [
      for branch, files_in_branch in files.files : [
        for file_dst, replace_str in files_in_branch : {
          repo        = repos
          branch_name = branch
          file_dst    = file_dst
          file_src    = "${path.module}/${replace_str.src}"
          src_dir     = try(replace_str.src_dir, null)
          content_terraform = try(replace_str.type_app, null) == null ? replace(
            replace(file("${path.module}/${replace_str.src}"), "SONAR_PROJECT", try(replace_str.sonar_project, "nic")),
          "MODULE_REPO_NAHRAD", try(replace_str.module_repo, "nic")) : null

          #Pracujeme s prommenyma definovanyma v (locals_branch_specifics.tf, objekt env_secrets_def, parameter "files = { branch = { soubor = {}}}")
          #Pokud type_app je nastaven na FE, tak:
          #  nahrad retezec REPO_NAHRAD za hodnotu v promenne ops_repo (Pokud promenna neni nastavena, nahrazuj retezcem "nic" - viz vysvetleni nize).
          #        Pouzito pro OPS i DEV repa.
          #  nahrad retezec AZURE_BLOB_NAHRAD za hodnotu v promenne azure_blob. Pouzito pro OPS repa.
          #  nahrad retezec URL_APP_DIR_NAHRAD za hodnotu v promenne url_dir. Pouzito pro OPS repa.
          #  nahrad retezec AZURE_ACCOUNT_NAHRAD za hodnotu v promenne azure_acc. Pouzito pro OPS repa.
          #  nahrad retezec NODE_VERSION_NAHRAD za hodnotu v promenne node_version. Pouzito pro DEV repa.

          #  nahrad retezec NODE_VERSION_NAHRAD za hodnotu v promenne node_version. Pouzito pro DEV repa.
          #  nahrad retezec ARTIFACTORY_REPO_NAME_NAHRAD za hodnotu v promenne artifactory_repo_name. Pouzito pro DEV i OPS repa.
          #  nahrad retezec SRC_DIR_NAHRAD za hodnotu v promenne src_dir. Pouzito pro DEV repa.
          #  nahrad retezec TYPE_NAHRAD za hodnotu v promenne type. Pouzito pro DEV repa.
          #  nahrad retezec ENV_NAHRAD za hodnotu v promenne env. Pouzito pro DEV repa.
          #  nahrad retezec LIBRARY_NAHRAD za hodnotu v promenne lib. Pouzito pro DEV repa.
          #
          # Pokud promenna neni nastavena, nahrazuj retezcem "nic"
          #  Ne vsechny soubory maji vsechny parametry, protoze musime nahradit jine stringy.
          #  Byla moznost vytvorit dalsi prommene nebo to obejit pomoci funkce try().
          content_fe = try(replace_str.type_app, null) == "fe" && var.pomocna_org == "dev" ? replace(
            replace(
              replace(
                replace(
                  replace(
                    replace(
                      replace(
                        replace(
                          replace(
                            replace(
                              replace(file("${path.module}/${replace_str.src}"), "REPO_NAHRAD", repos),
                            "CRON_EXPRESION_NAHRAD", try(replace_str.cron_expression, "nic")),
                          "AZURE_BLOB_NAHRAD", try(replace_str.azure_blob, "nic")),
                        "URL_APP_DIR_NAHRAD", try(replace_str.url_dir, "nic")),
                      "AZURE_ACCOUNT_NAHRAD", try(replace_str.azure_acc, "nic")),
                    "NODE_VERSION_NAHRAD", try(replace_str.node_version, "nic")),
                  "ARTIFACTORY_REPO_NAME_NAHRAD", try(replace_str.artifactory_repo_name, "nic")),
                "SRC_DIR_NAHRAD", try(replace_str.src_dir, "nic")),
              "TYPE_NAHRAD", try(replace_str.type, "nic")),
            "ENV_NAHRAD", try(replace_str.env, "nic")),
          "LIBRARY_NAHRAD", try(replace_str.lib, "nic")) : null
          #Pracujeme s prommenyma definovanyma v (locals_branch_specifics.tf, objekt env_secrets_def, parameter "files = { branch = { soubor = {}}}")
          #Pokud type_app je nastaven na BE, tak:
          #  nahrad retezec OPS_REPO_NAHRAD za hodnotu v promenne ops_repo (Pokud promenna neni nastavena, nahrazuj retezcem "nic" - viz vysvetleni nize)
          #  nahrad retezec HELM_CHARTS_NAHRAD za hodnotu v promenne helm_chart (Pokud promenna neni nastavena, nahrazuj retezcem "nic" - viz vysvetleni nize)
          #  nahrad retezec IMAGE_REPO_NAHRAD za hodnotu sestavenou z jmena organizace lomeno hodnota v promenne repos(Pozor zde se jedna o jmeno repository) - csas-dev/rates-bond-rates
          #  nahrad retezec CHART_REPO_NAHRAD za hodnotu v promenne chart_repo (Pokud promenna neni nastavena, nahrazuj retezcem "nic" - viz vysvetleni nize)
          #jinak:
          #  content_be nastav na hodnotu null
          #
          # Pokud promenna neni nastavena, nahrazuj retezcem "nic"
          #  Ne vsechny soubory maji vsechny parametry, protoze musime nahradit jine stringy.
          #  Byla moznost vytvorit dalsi prommene nebo to obejit pomoci funkce try().
          content_be = try(replace_str.type_app, null) == "be" && var.pomocna_org == "dev" ? replace(
            replace(
              replace(
                replace(
                  replace(
                    replace(
                      replace(
                        replace(
                          replace(
                            replace(
                              replace(
                                replace(file("${path.module}/${replace_str.src}"), "CHART_REPO_NAHRAD", try(replace_str.chart_repo, "nic")),
                              "CRON_EXPRESION_NAHRAD", try(replace_str.cron_expression, "nic")),
                            "NAHRAD_ENV", try(replace_str.ops_environment, "[\"deva\",\"edu\",\"int\",\"prs\",\"pred\",\"prod\",\"uat1\"]")),
                          "BRANCH_NAME_NAHRAD", try(replace_str.branch_name, "deva")),
                        "APP_NAME_NAHRAD", try(replace_str.laf_app_name, repos)),
                      "GRADLE_MAVEN_NAHRAD", try(replace_str.gradle_maven, "maven")),
                    "SAS_NAHRAD", try(replace_str.sas, "nic")),
                  "LABEL_NAME_NAHRAD", try(replace_str.label_nahrad, "nic")),
                "IMAGE_REPO_NAHRAD", try(join("/", [replace_str.image_repo, repos]), "nic")),
              "HELM_CHARTS_NAHRAD", try(replace_str.helm_chart, false)),
            "JAVA_VERSION_NAHRAD", try(replace_str.java_version, 11)),
          "OPS_REPO_NAHRAD", try(replace_str.ops_repo, "nic")) : null
        } if repos == var.repository_name
      ]
    ] if try(files.files, null) != null
  ])
}
