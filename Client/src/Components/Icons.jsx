import { FileHtml, FileCss, FileJs, FileText, FileCode, FileImage, FilePdf, FileZip, File } from "lucide-react";

const fileTypeIcons = [
  { type: "html", icon: <FileHtml size={20} /> },
  { type: "css", icon: <FileCss size={20} /> },
  { type: "js", icon: <FileJs size={20} /> },
  { type: "json", icon: <FileCode size={20} /> },
  { type: "txt", icon: <FileText size={20} /> },
  { type: "md", icon: <FileText size={20} /> },
  { type: "png", icon: <FileImage size={20} /> },
  { type: "jpg", icon: <FileImage size={20} /> },
  { type: "jpeg", icon: <FileImage size={20} /> },
  { type: "gif", icon: <FileImage size={20} /> },
  { type: "svg", icon: <FileImage size={20} /> },
  { type: "pdf", icon: <FilePdf size={20} /> },
  { type: "zip", icon: <FileZip size={20} /> },
  { type: "default", icon: <File size={20} /> }
];

// Helper function
export const getFileIcon = (filename) => {
  const ext = filename.split(".").pop().toLowerCase();
  const file = fileTypeIcons.find(f => f.type === ext);
  return file ? file.icon : fileTypeIcons.find(f => f.type === "default").icon;
};
