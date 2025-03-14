// For Multiple Exports of the parsed data
export interface ExportOptions {
  format: 'json' | 'pdf' | 'docx' | 'xml' | 'csv' | 'markdown' | 'html';
  template?: string;
  styling?: {
    font?: string;
    colors?: {
      primary: string;
      secondary: string;
    };
  };
}