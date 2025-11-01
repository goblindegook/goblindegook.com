import littlefoot from 'littlefoot'
import type { UnloadCallback } from './load'

export function setupFootnotes(): UnloadCallback {
  return littlefoot({
    allowDuplicates: true,
  }).unmount
}
