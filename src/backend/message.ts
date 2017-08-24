import SlackClient from './slack_client'

export default class Message {
  private slackClient: SlackClient
  public id: string
  public channelId: string
  public parentId: string
  public text: string

  public constructor (event) {
    this.slackClient = new SlackClient()
    this.text = event.text
    this.id = event.ts
    this.channelId = event.channel
    this.parentId = event.thread_ts
  }

  public async reply (message: string, byThread: boolean = false) {
    if (byThread) {
      await this.slackClient.postMessage(this.channelId, message, { thread_ts: this.parentId || this.id })
    } else {
      if (this.parentId) {
        await this.slackClient.postMessage(this.channelId, message, { thread_ts: this.parentId })
      } else {
        await this.slackClient.postMessage(this.channelId, message)
      }
    }
  }
}
