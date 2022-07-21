interface Process {
  exit(code ? : number): void;
}

declare let process: Process;