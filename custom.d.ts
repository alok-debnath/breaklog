import "react";

// A custom.d.ts file in a TypeScript project is used for declaring custom type definitions
declare module "react" {
  interface CSSProperties {
    "--value"?: number;
  }
}
