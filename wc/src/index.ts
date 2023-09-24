#!/usr/bin/env node

import fs from 'fs';
import { platform } from 'os';

const flags = { c: false, l: false, w: false, m: false };
let file: string = '';
let fileName: string = '';
let filePath: string = '';
let output: string = '';

const args = process.argv.slice(2);

let i = 0;
for (const arg of args) {
  if (arg === '-c') {
    flags.c = true;
  } else if (arg === '-l') {
    flags.l = true;
  } else if (arg === '-w') {
    flags.w = true;
  } else if (arg === '-m') {
    flags.m = true;
  } else {
    filePath = arg;
  }
}

let content: string;

if (args.length === 0) {
  content = fs.readFileSync(0, 'utf-8');
} else {
  filePath = args[0] as string;
  fileName = getFileNameFromPath(filePath);
  try {
    content = fs.readFileSync(filePath, 'utf-8');
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
}

if (flags.c) {
  const byteCount = Buffer.from(content, 'utf-8').length;
  output += `${byteCount}\t`;
}

if (flags.l) {
  output += `${getNumberOfLines(content)}\t`;
}

if (flags.w) {
  output += `${getNumberOfWords(content)}\t`;
}

if (flags.m) {
  output += `${getNumberOfChar(content)}\t`;
}

if (!output) {
  const byteCount = Buffer.from(content, 'utf-8').length;
  output += `${byteCount}\t${getNumberOfLines(content)}\t${getNumberOfWords(
    content
  )}\t`;
}

if (fileName) {
  output += `${fileName}`;
}

console.log(output);

function getFileNameFromPath(filePath: string): string {
  let fileName: string | undefined = '';
  if (platform() === 'linux') {
    fileName = filePath.split('/')[filePath.split('/').length - 1];
  } else if (platform() === 'win32') {
    fileName = filePath.split('\\')[filePath.split('\\').length - 1];
  }
  return fileName || '';
}

function getNumberOfLines(content: string): number {
  const lineLength = content.split('\n').length - 1;
  return lineLength;
}

function getNumberOfWords(content: string): number {
  return content.split(/\s+/).length - 1;
}

function getNumberOfChar(content: string): number {
  return content.split('').length;
}
