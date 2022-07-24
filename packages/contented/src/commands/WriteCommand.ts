import { Command } from 'clipanion';

export class WriteCommand extends Command {
  static paths = [[`write`]];

  async execute() {
    console.log('write');
  }
}