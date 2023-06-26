#! /usr/bin/env node
import { runExit } from 'clipanion';

import { BuildCommand } from './commands/BuildCommand.js';
import { GenerateCommand } from './commands/GenerateCommand.js';
import { WatchCommand } from './commands/WatchCommand.js';
import { WriteCommand } from './commands/WriteCommand.js';

// eslint-disable-next-line @typescript-eslint/no-floating-promises
runExit([BuildCommand, GenerateCommand, WatchCommand, WriteCommand]);
