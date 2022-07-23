#! /usr/bin/env node
import { runExit } from 'clipanion';
import { WatchCommand } from './commands/WatchCommand';
import { BuildCommand } from './commands/BuildCommand';

runExit([WatchCommand, BuildCommand]);
