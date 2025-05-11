// src/types/quill-cursors.d.ts
declare module "quill-cursors" {
  import Quill from "quill";

  class QuillCursors {
    constructor(quill: Quill, options?: any);
    createCursor(id: string, name: string, color: string): void;
    moveCursor(id: string, range: any): void;
    removeCursor(id: string): void;
    setCursor(id: string, range: any, name: string, color: string): void;
    clearCursors(): void;
  }

  export = QuillCursors;
}
