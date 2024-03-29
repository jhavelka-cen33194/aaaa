import fs from 'node:fs/promises'
import os from 'node:os'
import path from 'node:path'

import * as crypto from 'crypto'

import {main} from '../src/main'
import * as readMetadataModule from '../src/read-metadata'

jest.mock('../src/read-metadata')
const readMetadataMock = jest.mocked(readMetadataModule)

const outputsFile = path.join(
  os.tmpdir(),
  `read-app-metadata-${crypto.randomBytes(16).toString('hex')}-test`
)

describe('main', () => {
  const testApp = {
    file: 'test.yaml',
    chart: 'test',
    name: 'test',
    repoURL: 'https://example.com',
    repoName: 'test',
    version: '1.0.0'
  }

  const envVars = process.env

  beforeEach(async () => {
    process.env = {...process.env}

    Object.keys(process.env)
      .filter(key => key.startsWith('INPUT_') || key.startsWith('GITHUB_'))
      .forEach(key => delete process.env[key])

    process.env.INPUT_RECURSIVE = 'false'
    process.env['GITHUB_OUTPUT'] = outputsFile

    await fs.writeFile(outputsFile, '', 'utf8')
  })

  afterEach(async () => {
    jest.resetAllMocks()
    process.env = envVars

    try {
      await fs.rm(outputsFile)
    } catch (e: unknown) {
      // ignore
    }
  })

  it('should fail on empty result', async () => {
    // Behavior
    readMetadataMock.readMetadata.mockResolvedValueOnce([])

    // Test
    await expect(main()).rejects.toThrowError()
  })

  it('should return single result in app output', async () => {
    // Behavior
    readMetadataMock.readMetadata.mockResolvedValueOnce([testApp])

    // Test
    await main()

    // Verify
    const outputs = (await fs.readFile(outputsFile, 'utf8')).split(/\r?\n/)
    expect(outputs.find(val => val.startsWith('files<<'))).toBeTruthy()
    expect(outputs).toContain(JSON.stringify([testApp.file]))
    expect(outputs.find(val => val.startsWith('apps<<'))).toBeTruthy()
    expect(outputs).toContain(JSON.stringify([testApp]))
    expect(outputs.find(val => val.startsWith('app<<'))).toBeTruthy()
    expect(outputs).toContain(JSON.stringify(testApp))

    for (const [key, value] of Object.entries(testApp)) {
      expect(outputs.find(val => val.startsWith(`${key}<<`))).toBeTruthy()
      expect(outputs).toContain(value)
    }
  })

  it('should return multiple results in files output', async () => {
    // Behavior
    readMetadataMock.readMetadata.mockResolvedValueOnce([testApp, testApp])

    // Test
    await main()

    // Verify
    const outputs = (await fs.readFile(outputsFile, 'utf8')).split(/\r?\n/)
    expect(outputs.find(val => val.startsWith('files<<'))).toBeTruthy()
    expect(outputs).toContain(JSON.stringify([testApp.file, testApp.file]))
    expect(outputs.find(val => val.startsWith('apps<<'))).toBeTruthy()
    expect(outputs).toContain(JSON.stringify([testApp, testApp]))
    expect(outputs.find(val => val.startsWith('name<<'))).toBeFalsy()
    expect(outputs).not.toContain(testApp.name)
  })

  it('should use correct defaults', async () => {
    // Behavior
    readMetadataMock.readMetadata.mockResolvedValueOnce([testApp])

    // Test
    await main()

    // Verify
    expect(readMetadataMock.readMetadata).toHaveBeenCalledWith('', [
      '*.{yml,yaml}'
    ])
  })

  it('should pass inputs with recursive', async () => {
    process.env.INPUT_DIR = 'foo/bar'
    process.env.INPUT_RECURSIVE = 'true'

    // Behavior
    readMetadataMock.readMetadata.mockResolvedValueOnce([testApp])

    // Test
    await main()

    // Verify
    expect(readMetadataMock.readMetadata).toHaveBeenCalledWith('foo/bar', [
      '**/*.{yml,yaml}'
    ])
  })

  it('should pass inputs with glob', async () => {
    process.env.INPUT_DIR = 'foo/bar'
    process.env.INPUT_RECURSIVE = 'true' // ignored
    process.env.INPUT_FILES = 'a.yaml\nsubdir/**/*.{yml,yaml}'

    // Behavior
    readMetadataMock.readMetadata.mockResolvedValueOnce([testApp])

    // Test
    await main()

    // Verify
    expect(readMetadataMock.readMetadata).toHaveBeenCalledWith('foo/bar', [
      'a.yaml',
      'subdir/**/*.{yml,yaml}'
    ])
  })
})
