/**
 * Decode URL string.
 *
 * @param  text URL text to decode.
 * @return      Decoded URL text.
 */
export function urldecode (text: string): string {
  return decodeURIComponent(text.replace(/\+/g, '%20'))
}
