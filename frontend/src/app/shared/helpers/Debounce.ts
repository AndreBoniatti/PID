import { debounce } from 'underscore';

export function Debounce(ms: number) {
  return (target: any, key: any, descriptor: any) => {
    descriptor.value = debounce(descriptor.value, ms);
    return descriptor;
  };
}
