export type stringInfo = {
  lowerCase: string;
  upperCase: string;
  characters: string[];
  length: number;
  extraInfo: Object | undefined;
};

type LoggerServiceCallback = (arg: string) => void;

export function calculateComplexity(stringInfo: stringInfo) {
  return Object.keys(stringInfo.extraInfo as any).length * stringInfo.length;
}

export function toUpperCaseWithCb(arg: string, cb: LoggerServiceCallback) {
  if (!arg) {
    cb("Invalid argument!");
    return;
  }
  cb(`called function with ${arg}`);
  return arg.toUpperCase();
}
