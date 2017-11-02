import Command from './command'
import Message from './message'
import * as WebClient from '@slack/client'

export async function execBot (data, context, callback) {
  const slackRetryReason = data.headers['X-Slack-Retry-Reason']

  if (slackRetryReason === 'http_timeout') {
    console.log('Ignore retrying request from Slack')
    return callback(null, { statusCode: 200 })
  }

  const body = JSON.parse(data.body)

  console.log('execBot:', body)

  if (body.type == 'url_verification') {
    const res = { challenge: body.challenge }
    return callback(null, { statusCode: 200, body: JSON.stringify(res) })
  }

  const event = body.event

  if (event.subtype == 'bot_message') {
    // FIXME: 自分のメッセージに反応しないようにするための暫定対策
    console.log('Ignore messages from bot')
    return callback(null, { statusCode: 200, body: JSON.stringify({ status: 'ok' }) });
  }

  switch (event.type) {
  case 'message':
    const msg = new Message(event)
    const res = await Command.execute(msg, event.text);

    break;
  }

  callback(null, { statusCode: 200, body: JSON.stringify({ status: 'ok' }) });
}
