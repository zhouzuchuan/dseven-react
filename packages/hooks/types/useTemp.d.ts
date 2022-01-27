export default function useTemp<T extends {}, LT extends {}>(data: T, lastData?: LT): T & LT;
