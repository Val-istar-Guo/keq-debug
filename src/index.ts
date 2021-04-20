import { Middleware } from 'keq'
import * as inspect from 'object-inspect'
import * as url from 'url'
import * as R from 'ramda'


export default function debug(): Middleware {
  const line = R.repeat('━', 70).join('')
  const topLine = `┏${line}`
  const leftLine = '┃ '
  const bottomLine = `┗${line}`

  return async(ctx, next) => {
    let expectMessage = 'Expect Request\n'
    expectMessage += `\tURL: ${url.format(ctx.url)}\n`

    expectMessage += '\tHeaders:\n'
    for (const [key, value] of ctx.headers.entries()) {
      expectMessage += `\t\t${key}=${value}\n`
    }

    expectMessage = expectMessage
      .split('\n')
      .map(msg => `${leftLine}${msg}`)
      .join('\n')

    expectMessage = `${topLine}\n${expectMessage}\n${bottomLine}`
    console.info(expectMessage)

    await next()

    let realMessage = 'Real Request\n'
    realMessage += `\tURL: ${url.format(ctx.url)}\n`
    realMessage += '\tHeaders:\n'
    for (const [key, value] of ctx.headers.entries()) {
      realMessage += `\t\t${key}=${value}\n`
    }

    realMessage += '\tBody:\n'
    realMessage += inspect(ctx.request.body, { indent: 2 }).replace(/.+/i, '\t\t$&')
    realMessage += '\n'

    realMessage += '\n'
    if (ctx.response) {
      realMessage += `Response: ${ctx.response.status}\n`
    } else {
      realMessage += 'Cannot find Response. Request may not sended.\n'
    }

    realMessage = realMessage
      .split('\n')
      .map(msg => `${leftLine}${msg}`)
      .join('\n')

    realMessage = `${topLine}\n${realMessage}\n${bottomLine}`
    console.info(realMessage)
  }
}
