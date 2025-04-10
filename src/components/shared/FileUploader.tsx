import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import FileIcon from "/assets/icons/file-upload.svg";
import { Button } from "../ui/button";

type FileUploaderType = {
   fieldChange: (FILE: File[]) => void;
   mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderType) => {
   const [file, setFile] = useState<File[]>([]);
   const [fileUrl, setFileUrl] = useState("");
   const onDrop = useCallback(
      (acceptedFiles: FileWithPath[]) => {
         setFile(acceptedFiles);
         fieldChange(acceptedFiles);
         setFileUrl(URL.createObjectURL(acceptedFiles[0]));
      },
      [file]
   );
   const { getRootProps, getInputProps } = useDropzone({
      onDrop,
      accept: {
         "image/*": [".jpeg", ".jpg", ".png", ".svg"],
      },
   });

   return (
      <div
         {...getRootProps()}
         className="flex flex-center flex-col bg-dark-3 rounded-xl cursor-pointer"
      >
         <input {...getInputProps()} className="cursor-pointer" />
         {fileUrl ? (
            <>
               <div className="flex flex-1 justify-center w-full p-5 lg:p-10">
                  <img
                     src={fileUrl}
                     alt="uploaded-file"
                     className="file_uploader-img"
                  />
               </div>
               <p className="file_uploader-label">
                  Click or Drag photo to replace.
               </p>
            </>
         ) : (
            <div className="file_uploader-box">
               <img src={FileIcon} alt="file-icon" width={96} height={77} />
               <h3 className="base-medium text-light-2 mb-2 mt-6">
                  Drag & Drop
               </h3>
               <h3 className="text-light-4 small-regular mb-6">
                  SVG, PNG, JPG, JPEG (10MB max)
               </h3>
               <Button className="shad-button_dark_4 w-full h-12">
                  <span className="text-light-2">Browse Files</span>
               </Button>
            </div>
         )}
      </div>
   );
};
export default FileUploader;
