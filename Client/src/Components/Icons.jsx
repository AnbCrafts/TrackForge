import {
  FileHtml,
  FileCss,
  FileJs,
  FileText,
  FileCode,
  FileImage,
  FilePdf,
  FileZip,
  File,
} from "lucide-react";

const fileTypeIcons = {
  html: <FileHtml size={20} />,
  css: <FileCss size={20} />,
  js: <FileJs size={20} />,
  json: <FileCode size={20} />,
  txt: <FileText size={20} />,
  md: <FileText size={20} />,
  png: <FileImage size={20} />,
  jpg: <FileImage size={20} />,
  jpeg: <FileImage size={20} />,
  gif: <FileImage size={20} />,
  svg: <FileImage size={20} />,
  pdf: <FilePdf size={20} />,
  zip: <FileZip size={20} />,
  default: <File size={20} />,
};

export const getFileIcon = (filename = "") => {
  const ext = filename.split(".").pop().toLowerCase();
  return fileTypeIcons[ext] || fileTypeIcons.default;
};
