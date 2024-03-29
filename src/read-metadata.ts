import fs from 'node:fs/promises'
import path from 'node:path'

import * as core from '@actions/core'
import {glob} from 'glob'
import YAML from 'yaml'

import {artifactoryRepoName} from './artifactory-repo-name'

export interface Application {
  file: string
  name: string
  repoURL: string
  repoName?: string
  chart?: string
  version: string
  values?: string | object
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type DataType = any
type Parser = (file: string, data: DataType) => Application | undefined

const parsers: Record<string, Parser> = {
  'argoproj.io,Application': argoApplicationParser,
  'ops.csas.cz,Application': argoApplicationParser,
  'cdn.csas.cz,StaticWebApplication': generalApplicationParser,
  'cdn.csas.cz,StorageAccount': generalApplicationParser,
  'db.csas.cz,Database': generalApplicationParser,
  'general.csas.cz,General': generalApplicationParser,
  'laf.csas.cz,JavaApplication': generalApplicationParser,
  'laf.csas.cz,JBossApplication': generalApplicationParser,
  'laf.csas.cz,WeblogicApplication': generalApplicationParser
}

export const readMetadata = async (
  cwd: string,
  patterns: string[]
): Promise<Application[]> => {
  // Find files
  const files = await glob(patterns, {
    cwd,
    nodir: true,
    posix: true
  })
  files.sort((a, b) => a.localeCompare(b))

  // Parse all files into Application objects
  core.info(`found yaml files: ${files}`)
  const result = await Promise.all(
    files.map(async f => readApplication(cwd, f))
  )

  // Remove undefined entries
  const apps = result.filter((app): app is Application => !!app)
  core.info(`using files: ${apps.map(f => f?.file)}`)

  // Return
  return apps
}

const readApplication = async (
  cwd: string,
  file: string
): Promise<Application | undefined> => {
  try {
    // Read and parse
    const content = await fs.readFile(path.resolve(cwd, file), {
      encoding: 'utf-8'
    })
    const data = YAML.parse(content)

    // Validate
    const group = String(data.apiVersion || '').replace(/\/[^\/]*$/, '')
    const kind = String(data.kind || '')

    const parser = parsers[`${group},${kind}`]
    if (!parser) {
      core.info(`unsupported file ${file}, unknown kind ${group}, ${kind}`)
      return undefined
    }

    // Convert to an object
    core.info(`parsing as ${group}, ${kind}`)
    const app = parser(file, data)
    if (!app) {
      core.warning(`missing mandatory fields, skipping`, {
        file
      })
      return undefined
    }

    // Return parsed object
    return app
  } catch (e: unknown) {
    core.warning(`failed to parse file: ${e}`, {file})
    return undefined
  }
}

function argoApplicationParser(
  file: string,
  data: DataType
): Application | undefined {
  const app = {
    file,
    name: data.metadata?.name,
    repoURL: data.spec?.source?.repoURL,
    repoName: artifactoryRepoName(data.spec?.source?.repoURL),
    chart: data.spec?.source?.chart,
    version: data.spec?.source?.targetRevision,
    values: data.spec?.source?.helm?.values
  }

  // Validate mandatory fields
  if (!app.name || !app.repoURL || !app.chart || !app.version) {
    return undefined
  }

  return app
}

function generalApplicationParser(
  file: string,
  data: DataType
): Application | undefined {
  const app = {
    file,
    name: data.metadata?.name,
    repoURL: data.spec?.source?.repoURL,
    repoName: undefined,
    chart: undefined,
    version: data.spec?.source?.targetRevision,
    values: data.spec?.source?.config?.values
  }

  // Validate mandatory fields
  if (!app.name || !app.repoURL || !app.version) {
    return undefined
  }

  return app
}
