import {
  generateUploadButton,
  generateUploadDropzone,
} from "@uploadthing/react";

// Import the file router without TypeScript-specific syntax
import { ourFileRouter } from "../app/api/uploadthing/core";

export const UploadButton = generateUploadButton();
export const UploadDropzone = generateUploadDropzone();
