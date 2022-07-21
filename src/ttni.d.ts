export type TItems = {
  caller: string,
  fn: string,
  path: string,
  file: string,
};
export type TSU = string | undefined;
export type TLevels = {
  [key: number | string]: string;
};
export type TColors = {
  [key: string]: number;
};
export type TLogs = {
  [key: string]: boolean;
}
export type TObj = {
  [key: string]: object;
};