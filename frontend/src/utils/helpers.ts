// src/utils/helpers.ts
export const classNames = (...classes: string[]) => {
  return classes.filter(Boolean).join(' ');
};

export const truncate = (str: string, length: number) => {
  if (str.length <= length) return str;
  return `${str.substring(0, length)}...`;
};

export const sleep = (ms: number) => new Promise(resolve => setTimeout(resolve, ms)); 