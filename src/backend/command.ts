import * as aws from 'aws-sdk'
import Message from './message'

var documentClient = new aws.DynamoDB.DocumentClient()

export default class Command {
  public paramPattern: string
  public script: string
  public errors: object[]

  public constructor (record: { [attr: string]: any }) {
    for (var attr in record) {
      this[attr] = record[attr]
    }
  }

  public execute (message: Message, ...args: string[]): boolean {
    console.log('Command#execute', args)

    try {
      this.function.apply(null, [...args, message])
    } catch (e) {
      console.log('command execution failed', e)
      return false
    }

    console.log('command execution succeeded')

    return true
  }

  public get paramPatternExp (): RegExp {
    return new RegExp(this.paramPattern)
  }

  public get function (): Function {
    return new Function('args', 'message', this.script)
  }

  public static async findByName (name: string): Promise<Command> {
    console.log('Command.findByName', { name: name })

    const query = {
      TableName: 'commands',
      FilterExpression: '#name = :name',
      ExpressionAttributeValues: {
        ':name': name
      },
      ExpressionAttributeNames: {
        '#name': 'name'
      }
    }

    const data = await documentClient.scan(query).promise()

    console.log(data)

    return data.Items[0] ? new Command(data.Items[0]) : null
  }

  public static async execute (message: Message, realCommand: string): Promise<boolean> {
    console.log('Command.execute', { realCommand: realCommand })

    const [_, name, argStr] = [...(realCommand.match(/([^\s]+)\s*(.*)/) || [])]
    console.log({ commandName: name, argStr: argStr })

    const command = await this.findByName(name)

    if (!command) {
      console.log('Command not found: ', name)
      return false
    }

    console.log('Command found: ', command)

    const args = argStr.match(command.paramPatternExp)

    if (!args) {
      console.log('arguments not matched: ', argStr)
      return false
    }

    args.shift()

    console.log('arguments matched: ', args)

    return command.execute(message, ...args)
  }
}
