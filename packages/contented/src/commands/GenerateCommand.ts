import { Command } from 'clipanion';

export class GenerateCommand extends Command {
  static paths = [[`generate`]];

  async execute() {
    console.log('generate');
  }
}