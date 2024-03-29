import * as core from '@actions/core'

import {main} from './main'

/**
 * GitHub Action entrypoint.
 */
async function run(): Promise<void> {
  try {
    await main()
  } catch (error) {
    if (error instanceof Error) core.setFailed(error.message)
    else core.setFailed(String(error))
  }
}

// noinspection JSIgnoredPromiseFromCall
run()
