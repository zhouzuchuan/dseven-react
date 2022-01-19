import _extends from "@babel/runtime/helpers/extends";
import { useRef } from 'react';
export default function useCache(data, lastData) {
  var cache = useRef(_extends({}, data, lastData));
  Object.entries(lastData || {}).forEach(function (_ref) {
    var k = _ref[0],
        v = _ref[1];
    Reflect.set(cache.current, k, v);
  });
  return cache.current;
}