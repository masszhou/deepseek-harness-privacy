/** Privacy fork: the Web bundle keeps feedback capture and the Session-log upload switch unloaded. */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { describe, expect, it } from 'vitest'
import { parseEntryYaml } from '@deepseek-ai/cordis-plugin-include'

describe('dsh-web-app privacy fork', () => {
  it('disables the feedback and Session-log upload rows', () => {
    const path = fileURLToPath(new URL('../cordis.patch.yml', import.meta.url))
    const patches = parseEntryYaml(readFileSync(path, 'utf8')) as { insert?: { id?: string; disabled?: unknown }[] }[]
    const rows = patches.flatMap(patch => patch.insert ?? [])
    for (const id of ['message-feedback', 'ui-message-feedback', 'ui-settings-session-log']) {
      expect(rows.find(row => row.id === id)?.disabled, id).toBe(true)
    }
  })
})
