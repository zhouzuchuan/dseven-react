export default function useLatestScope<T extends Function>(handler: T): (...args: any[]) => any;
