export default function useCache<T extends {}, LT extends {}>(data: T, lastData?: LT): T & LT;
