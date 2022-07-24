#! /usr/bin/env node
import { runExit } from 'clipanion';

import { BuildCommand } from './commands/BuildCommand.js';
import { GenerateCommand } from './commands/GenerateCommand.js';
import { WatchCommand } from './commands/WatchCommand.js';
import { WriteCommand } from './commands/WriteCommand.js';

runExit([
  BuildCommand,
  GenerateCommand,
  WatchCommand ,
  WriteCommand
]);

// TODO(fuxingloh): Watch

// TODO(fuxingloh): Watch = edit: file -> processor.process(file)
// TODO(fuxingloh): Watch = add,remove,rename: files -> processor.build(files)

// TODO(fuxingloh): add preview