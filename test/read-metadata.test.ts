import {Application, readMetadata} from '../src/read-metadata'

describe('read metadata', () => {
  const appA: Application = {
    file: 'a.yaml',
    name: 'a-name',
    repoURL:
      'https://artifactory.csin.cz:443/artifactory/api/helm/foo-bar-helm',
    repoName: 'foo-bar-helm',
    chart: 'a-chart',
    version: '1.2.3',
    values: 'replicaCount: 1\ntest: config\n'
  }

  const appB: Application = {
    file: 'subdir/b.yml',
    name: 'b-name',
    repoURL:
      'https://artifactory.csin.cz:443/artifactory/api/helm/foo-bar-helm',
    repoName: 'foo-bar-helm',
    chart: 'b-chart',
    version: '3.4.5',
    values: 'foobar: 34'
  }

  const appLaf: Application = {
    file: 'laf/manifest-weblogic.yml',
    name: 'java-app-weblogic',
    repoURL:
      'https://artifactory.csin.cz/artifactory/cicd-samples-maven-releases-local/cz/csas/cicd/samples/java-app-weblogic/0.1.2/java-app-weblogic-0.1.2.war',
    version: '0.1.2',
    values: {
      laf: {
        application: 'weblogic2',
        environment: 'tst',
        project: 'sasgroup'
      }
    }
  }

  it('should return empty list', async () => {
    await expect(readMetadata('', ['test.foo'])).resolves.toEqual([])
  })

  it('should return single app from dir', async () => {
    // NOTE this must skip invalid and unsupported yaml files

    // Test
    const result = await readMetadata('test/fixtures', ['*.{yml,yaml}'])

    // Verify
    expect(result).toEqual([appA])
  })

  it('should return single app for file', async () => {
    // Test
    const result = await readMetadata('test/fixtures', ['a.yaml'])

    // Verify
    expect(result).toEqual([appA])
  })

  it('should return apps for a dir', async () => {
    // Test
    const result = await readMetadata('test/fixtures/', ['**/*.{yml,yaml}'])

    // Verify
    expect(result).toEqual([appA, appLaf, appB])
  })

  it('should return all apps for multiple files, sorted', async () => {
    // Test
    const result = await readMetadata('test/fixtures', [
      'subdir/b.yml',
      'a.yaml'
    ])

    // Verify
    expect(result).toEqual([appA, appB])
  })
})
