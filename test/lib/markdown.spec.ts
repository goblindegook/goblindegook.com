import { screen } from '@testing-library/dom'
import { afterEach, expect, test } from 'vitest'
import { markdown } from '../../assets/scripts/lib/markdown'

afterEach(() => {
  document.body.innerHTML = ''
})

test('sanitizes HTML while preserving safe content', () => {
  const content = markdown(
    '**Safe content**<script>alert(1)</script><img src="image.jpg" onerror="alert(1)"><a href="javascript:alert(1)">Link</a>',
  )
  document.body.append(content)

  expect(screen.getByText('Safe content').tagName).toBe('STRONG')
  expect(content.querySelector('script')).toBeNull()
  expect(screen.getByRole('img').hasAttribute('onerror')).toBe(false)
  expect(screen.getByText('Link').hasAttribute('href')).toBe(false)
})
