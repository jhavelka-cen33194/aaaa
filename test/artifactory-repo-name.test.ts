import {artifactoryRepoName} from '../src/artifactory-repo-name'

describe('artifactory-repo-name', () => {
  it('should return last segment of url', () => {
    const result = artifactoryRepoName(
      'https://example.com/artifactory/foo-bar'
    )
    expect(result).toBe('foo-bar')
  })

  it('should return last segment of url with slash', () => {
    const result = artifactoryRepoName(
      'https://example.com/artifactory/foo-bar/'
    )
    expect(result).toBe('foo-bar')
  })

  it('should not throw on invalid url', () => {
    expect(artifactoryRepoName('foo-bar')).toBeUndefined()
    expect(artifactoryRepoName('https:')).toBeUndefined()
  })

  it('should not accept other then https? protocol', () => {
    expect(artifactoryRepoName('file:///asdasd/asda/asd')).toBeUndefined()
  })
})
