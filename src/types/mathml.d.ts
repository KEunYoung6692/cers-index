import type * as React from "react";

type MathMLElementProps = React.DetailedHTMLProps<React.HTMLAttributes<HTMLElement>, HTMLElement>;

declare global {
  namespace JSX {
    interface IntrinsicElements {
      annotation: MathMLElementProps & { encoding?: string };
      math: MathMLElementProps & { display?: string };
      mi: MathMLElementProps;
      mn: MathMLElementProps;
      mo: MathMLElementProps;
      mrow: MathMLElementProps;
      msub: MathMLElementProps;
      mtext: MathMLElementProps;
      munder: MathMLElementProps;
      semantics: MathMLElementProps;
    }
  }
}

export {};
