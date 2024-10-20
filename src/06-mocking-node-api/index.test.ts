// Uncomment the code below and write your tests
import path from 'path';
import { readFileAsynchronously, doStuffByTimeout, doStuffByInterval } from '.';

describe('doStuffByTimeout', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setTimeout');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('should set timeout with provided callback and timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);
    expect(setTimeout).toHaveBeenCalledWith(callback, timeout);
  });

  test('should call callback only after timeout', () => {
    const callback = jest.fn();
    const timeout = 1000;

    doStuffByTimeout(callback, timeout);
    expect(callback).not.toBeCalled();

    jest.advanceTimersByTime(timeout);
    expect(callback).toBeCalled();
  });
});

describe('doStuffByInterval', () => {
  beforeEach(() => {
    jest.useFakeTimers();
    jest.spyOn(global, 'setInterval');
  });

  afterEach(() => {
    jest.useRealTimers();
    jest.restoreAllMocks();
  });

  test('should set interval with provided callback and timeout', () => {
    const callback = jest.fn();
    const interval = 1000;

    doStuffByInterval(callback, interval);
    expect(setInterval).toHaveBeenCalledWith(callback, interval);
  });

  test('should call callback multiple times after multiple intervals', () => {
    const callback = jest.fn();
    const interval = 1000;
    const times = 3;

    doStuffByInterval(callback, interval);
    expect(callback).not.toBeCalled();

    for (let i = 0; i < times; i++) {
      jest.advanceTimersByTime(interval);
    }

    expect(callback).toHaveBeenCalledTimes(times);
  });
});

describe('readFileAsynchronously', () => {
  test('should call join with pathToFile', async () => {
    const pathToFile = 'test.txt';
    const joinSpy = jest.spyOn(require('path'), 'join');

    await readFileAsynchronously(pathToFile);
    expect(joinSpy).toHaveBeenCalledWith(__dirname, pathToFile);
  });

  test('should return null if file does not exist', async () => {
    const pathToFile = 'nonexistent.txt';
    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBeNull();
  });

  test('should return file content if file exists', async () => {
    const pathToFile = 'existing.txt';
    const fs = require('fs');
    fs.writeFileSync(path.join(__dirname, pathToFile), 'Hello, World!');

    const result = await readFileAsynchronously(pathToFile);
    expect(result).toBe('Hello, World!');

    // Clean up
    fs.unlinkSync(path.join(__dirname, pathToFile));
  });
});
