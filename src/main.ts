import * as core from '@actions/core'

import {readMetadata} from './read-metadata'

export const main = async (): Promise<void> => {
  // Inputs
  const dir = core.getInput('dir') || ''
  const recursive = core.getBooleanInput('recursive')
  const filesInput = core.getMultilineInput('files', {})
  const glob = filesInput.length > 0 ? filesInput : [defaultGlob(recursive)]

  // Call
  const apps = await readMetadata(dir, glob)

  // Fail when nothing has been found
  if (apps.length === 0) {
    throw new Error(`No files found on path ${dir} with pattern ${glob}`)
  }

  // Set outputs
  core.setOutput(
    'files',
    apps.map(app => app.file)
  )
  core.setOutput('apps', apps)

  // Single app output
  if (apps.length === 1) {
    core.setOutput('app', apps[0])
    core.setOutput('file', apps[0].file)
    core.setOutput('name', apps[0].name)
    core.setOutput('repoURL', apps[0].repoURL)
    core.setOutput('repoName', apps[0].repoName)
    core.setOutput('chart', apps[0].chart)
    core.setOutput('version', apps[0].version)
    core.setOutput('values', apps[0].values)
  }
}

const yamlPattern = '*.{yml,yaml}'

const defaultGlob = (recursive?: boolean): string =>
  recursive ? `**/${yamlPattern}` : yamlPattern
