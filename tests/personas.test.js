import { test } from 'node:test'
import assert from 'node:assert/strict'
import { cleanUrl, parsePersonas, validatePersonas } from '../shared/personas.js'
import { apiResponse, personas } from './fixtures.js'

test('validates each tool and rejects shapes that would crash React', () => {
  for (const kind of ['main', 'fashion', 'deploy', 'plate', 'fitness']) assert.equal(parsePersonas(apiResponse(kind), kind).length, 3)
  for (const field of ['name', 'age', 'goals', 'quote']) {
    const data = personas('main')
    data[0][field] = { unsafe: 'object' }
    assert.throws(() => validatePersonas(data, 'main'))
  }
  assert.throws(() => validatePersonas([null, null, null], 'main'))
  assert.throws(() => validatePersonas(personas('main').slice(1), 'main'))
  assert.throws(() => parsePersonas({ ...apiResponse('main'), stop_reason: 'max_tokens' }, 'main'))
  const fenced = apiResponse('main')
  fenced.content[0].text = '```json\n' + fenced.content[0].text + '\n```'
  assert.equal(parsePersonas(fenced, 'main').length, 3)
})

test('removes query tokens and fragments and rejects credential-bearing URLs', () => {
  assert.equal(cleanUrl('https://example.com/product?token=secret#private'), 'https://example.com/product')
  for (const url of ['javascript:alert(1)', 'https://user:password@example.com', 'not a url', 'file:///private']) assert.throws(() => cleanUrl(url))
  assert.equal(cleanUrl(''), '')
})
