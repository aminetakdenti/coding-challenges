#!/usr/bin/env node

import fs from 'fs';
import { platform } from 'os';
import path from 'path';

enum ERRORS {
  'fileName' = 'you need more: file name or the path...',
}

(function () {
  const args = process.argv.slice(2);
  const filePath = doesFileExist(args[1] || '');

  switch (args[0]) {
    case '-c':
      getSizeOfFile(filePath);
      break;

    case '-l':
      getNumberOfLines(filePath);
      break;

    case '-w':
      getNumberOfWords(filePath);
      break;

    default:
      console.log('...');
      break;
  }
})();

function getFileNameFromPath(filePath: string): string {
  let fileName: string | undefined = '';
  if (platform() === 'linux') {
    fileName = filePath.split('/')[filePath.split('/').length - 1];
  } else if (platform() === 'win32') {
    fileName = filePath.split('\\')[filePath.split('\\').length - 1];
  }
  return fileName || '';
}

function getSizeOfFile(arg: string): void {
  return console.log(`${fs.statSync(arg).size} ${getFileNameFromPath(arg)}`);
}

function getNumberOfLines(arg: string): void {
  const file = fs.readFileSync(arg, 'utf-8');
  const lineLength = file.split('\n').length - 1;
  const fileName = getFileNameFromPath(arg);
  return console.log(`${lineLength} ${fileName}`);
}

function getNumberOfWords(arg: string): void {
  const fileWords = fs.readFileSync(arg, 'utf-8').split(/\s+/).length - 1;
  return console.log(`${fileWords} ${getFileNameFromPath(arg)}`);
}

function doesFileExist(arg: string) {
  const filePath = path.join(process.cwd(), arg);
  if (!fs.existsSync(filePath)) {
    console.error(ERRORS.fileName);
    return process.exit(1);
  }
  return filePath;
}
