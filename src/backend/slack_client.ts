import { WebClient } from '@slack/client'

export default class SlackClient {
  public client: WebClient

  public constructor () {
    this.client = new WebClient(process.env.SLACK_BOT_TOKEN)
  }

  public async postMessage (channel: string, text: string, options: {} = {}) {
    await this.client.chat.postMessage(channel, text, options)
  }
}
