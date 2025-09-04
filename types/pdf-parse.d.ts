// types/pdf-parse.d.ts
declare module "pdf-parse" {
  export interface PDFInfo { [k: string]: any }
  export interface PDFMetadata { [k: string]: any }
  export interface PDFParseOptions {
    version?: string;
    max?: number;
    [k: string]: any;
  }
  export interface PDFData {
    numpages: number;
    numrender: number;
    info: PDFInfo;
    metadata?: PDFMetadata;
    text: string;
    version: string;
  }

  const pdfParse: (
    data: Buffer | Uint8Array | ArrayBuffer,
    options?: PDFParseOptions
  ) => Promise<PDFData>;

  export default pdfParse;
}
