#! /usr/bin/env node
import { runExit } from 'clipanion';
import { WatchCommand } from './commands/WatchCommand';
import { BuildCommand } from './commands/BuildCommand';

runExit([WatchCommand, BuildCommand]);

// TODO(fuxingloh): Watch

// TODO(fuxingloh): Watch = edit file, .json file change
// TODO(fuxingloh): Watch = add file, single.json + type.mjs change, index.mjs change
// TODO(fuxingloh): Watch = remove file, single.json + type.mjs change, index.mjs change
