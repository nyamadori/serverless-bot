import Command from './command'
import Message from './message'
import * as WebClient from '@slack/client'

export async function execBot (data, context, callback) {
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

  // const loadBot = new Function('bot', data.bot.program);
  // const bot = {
  //   brain: {
  //     get: (key, callback) => {
  //       const query = {
  //         TableName: 'bot_brains',
  //         Key: {
  //           bot_id: '1'
  //         },
  //       };
  //
  //       documentClient.get(query, (err, res) => callback(err, res.Item.data[key]));
  //     },
  //
  //     set: (key, value, callback) => {
  //       const newItem = {
  //         bot_id: '1',
  //         data: {}
  //       };
  //
  //       newItem.data[key] = value;
  //
  //       const query = {
  //         TableName: 'bot_brains',
  //         Item: newItem
  //       };
  //
  //       documentClient.put(query, callback);
  //     }
  //   }
  // };
  //
  // loadBot(bot);
  // bot[data.event.name].apply(this, data.event.args);
  //
  // bot.brain.get('counter', (err, value) => {
  //   bot.brain.set('counter', value + 1, (err, res) => {
  //     console.log(err, data);
  //   })
  // })
  //
  // callback(null, { result: 'ok', brain: bot.brain });
}
