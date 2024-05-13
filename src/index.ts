import { KeqMiddleware } from 'keq'
import { KeqRequestContext } from 'keq/dist/esm/src/types/keq-context.js'
import inspect from 'object-inspect'
import { compile } from 'path-to-regexp'
import * as R from 'ramda'
import * as url from 'url'


interface Options {
  requestBody?: boolean
  responseBody?: boolean
}

function prefixEachLine(str: string, prefix: string): string {
  return str
    .split('\n')
    .map((msg) => `${prefix}${msg}`)
    .join('\n')
}

function chunkString(str: string, length: number): string {
  const chunks = str.match(new RegExp(`.{1,${length}}`, 'g')) || []
  return chunks.join('\n')
}

function formatHeader(key: string, value: string): string {
  let str = chunkString(value, 60)
  const [firstLine, ...lines] = str.split('\n')
  const space = R.repeat(' ', key.length + 1).join('')
  str = lines.map((line) => `${space}${line}`).join('\n')

  if (str) return `${key}=${firstLine}\n${str}`
  return `${key}=${firstLine}`
}

function formatUrl(keqURL: KeqRequestContext['url']): string {
  const urlobj = url.parse(url.format(keqURL))

  if (urlobj.pathname) {
    const toPath = compile(urlobj.pathname, { encode: encodeURIComponent })
    urlobj.pathname = toPath(keqURL.params)
  }

  return url.format(urlobj)
}

export default function debug({
  responseBody = false,
  requestBody = false,
}: Options = {}): KeqMiddleware {
  const line = R.repeat('━', 70).join('')
  const topLine = `┏${line}`
  const leftLine = '┃ '
  const bottomLine = `┗${line}`

  return async function debug(ctx, next) {
    let expectMessage = 'Expect Request\n'
    expectMessage += `\t${ctx.request.method.toUpperCase()}: ${formatUrl(ctx.request.url)}\n`

    expectMessage += '\tHeaders:\n'
    ctx.request.headers.forEach((value, key) => {
      const str = formatHeader(key, value)
      expectMessage += prefixEachLine(str, '\t\t')
      expectMessage += '\n'
    })

    expectMessage = prefixEachLine(expectMessage, leftLine)

    expectMessage = `${topLine}\n${expectMessage}\n${bottomLine}`
    console.info(expectMessage)

    await next()

    let realMessage = 'Real Request\n'
    realMessage += `\t${ctx.request.method.toUpperCase()}: ${formatUrl(ctx.request.url)}\n`
    realMessage += '\tHeaders:\n'
    ctx.request.headers.forEach((value, key) => {
      const str = formatHeader(key, value)
      realMessage += prefixEachLine(str, '\t\t')
      realMessage += '\n'
    })

    if (requestBody) {
      realMessage += '\tBody:\n'

      const body = inspect(ctx.request.body, { indent: 2 })
      realMessage += prefixEachLine(body, '\t\t')
      realMessage += '\n'
    }

    realMessage += '\n'
    if (ctx.response) {
      realMessage += `Response: ${ctx.response.status}\n`
    } else {
      realMessage += 'Cannot find Response. Request may not sended.\n'
    }

    if (responseBody && ctx.response && ctx.response.status !== 204) {
      const contentType = ctx.response.headers.get('content-type')
      realMessage += `\tBody: ${contentType}\n`
      if (contentType && contentType.includes('application/json')) {
        let body = await ctx.response.json()
        body = inspect(body, { indent: 2 })
        body = prefixEachLine(body, '\t\t')
        realMessage += `${body}\n`
      }
    }

    realMessage = realMessage
      .split('\n')
      .map((msg) => `${leftLine}${msg}`)
      .join('\n')

    realMessage = `${topLine}\n${realMessage}\n${bottomLine}`
    console.info(realMessage)
  }
}
