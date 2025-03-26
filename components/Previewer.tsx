import React from "react";
import Image, { StaticImageData } from "next/image";
import Logo from '@/public/logo.png';

type ImagePreviewProps = {
  src: string | StaticImageData | null;
};

const Previewer = ({ src }: ImagePreviewProps) => {
  console.log('Previewer src:', src);
  // Ensure we have a valid source, default to Logo if invalid
  const validSrc = src && typeof src === "string" && src.trim() !== "" ? src : Logo;

  // Check file type based on extension
  const isImage = typeof validSrc === "string" && /\.(jpg|jpeg|png|gif|webp)$/i.test(validSrc);
  const isPdf = typeof validSrc === "string" && /\.pdf(\?.*)?$/i.test(validSrc);

  console.log('isImage:', isImage, 'isPdf:', isPdf, 'validSrc:', validSrc);

  if (isImage || validSrc === Logo) {
    return (
      <div className="flex justify-center">
        <Image
          src={validSrc}
          alt="Preview"
          width={300}
          height={200}
          style={{ objectFit: "contain" }}
        />
      </div>
    );
  } else if (isPdf) {
    // Append PDF viewer parameters to control rendering and scale
    const pdfSrc = `${validSrc}#view=FitH&zoom=150&pagemode=none`;

    return (
      <div className="w-full flex justify-center">
        <iframe
          src={pdfSrc}
          title="PDF Preview"
          className="w-full max-w-4xl h-[80vh] max-h-[1000px] border-0"
          style={{
            transform: 'rotate(0deg)', // Change to 'rotate(90deg)' for landscape
            transformOrigin: 'center center', // Rotate from center
          }}
        />
      </div>
    );
  } else {
    return (
      <div className="flex justify-center">
        <Image
          src={Logo}
          alt="Unsupported file type"
          width={300}
          height={200}
          style={{ objectFit: "contain" }}
        />
      </div>
    );
  }
};

export default Previewer;