import * as core from '@actions/core'

export const artifactoryRepoName = (
  url: string | undefined
): string | undefined => {
  if (!url) return undefined

  try {
    const {protocol, pathname} = new URL(url)
    if (!protocol?.startsWith('http')) return undefined

    const m = pathname.match(/\/([^/]+)\/*$/)
    return m ? m[1] : undefined
  } catch (e: unknown) {
    if (core.isDebug()) core.debug(`failed to parse url '${url}': ${e}`)
    return undefined
  }
}
