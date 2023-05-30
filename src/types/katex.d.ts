declare module "katex/contrib/auto-render/splitAtDelimiters" {
  export default function splitAtDelimiters(
    text: string,
    delimiters: {
      /**
       * A string which starts the math expression (i.e. the left delimiter)
       */
      left: string;
      /**
       * A string which ends the math expression (i.e. the right delimiter)
       */
      right: string;
      /**
       * A boolean of whether the math in the expression should be rendered in display mode or not
       */
      display: boolean;
    }[]
  ): Array<
    | { type: "text"; data: string }
    | { type: "math"; data: string; rawData: string; display: boolean }
  >;
}
