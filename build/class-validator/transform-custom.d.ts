type TransformUriOptions = {
    each?: boolean;
};
type TransformPairsOptions = {
    each?: boolean;
    type: any;
};
export declare const TransformUri: (options?: TransformUriOptions) => PropertyDecorator;
export declare const TransformDate: PropertyDecorator;
export declare const TransformPair: (options?: TransformPairsOptions) => PropertyDecorator;
export {};
