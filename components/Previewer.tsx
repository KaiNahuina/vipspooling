import React from "react";
import Image, { StaticImageData } from "next/image";


type ImagePreviewProps = {
    //file: File | null;  This type is still in place, but it won't be used for now
    src: string | StaticImageData;
  };

  //Change src with file if using the file declaration in ImagePreviewProps
  const Previewer = ({ src }: ImagePreviewProps) => {
    
    return (
        <div>
            <Image
            src={src}
            alt="Preview"
            style={{ width: "300px", objectFit: "contain" }}
            />
      </div>
    );
  };
  
  export default Previewer;