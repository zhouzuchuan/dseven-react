/// <reference types="react" />
export declare const objectToString: (style: string | Record<string, any>) => string;
/**
 * 合并 style
 * @param {Object|String} style1
 * @param {Object|String} style2
 * @returns {String}
 */
export declare const mergeStyle: (style1: string | React.CSSProperties, style2: string | React.CSSProperties) => string | import("react").CSSProperties;
