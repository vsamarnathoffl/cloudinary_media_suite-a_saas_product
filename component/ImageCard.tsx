import React, { useState } from "react";
import { getCldImageUrl } from "next-cloudinary";
import { Download, Trash, Share2 } from "lucide-react";
import { filesize } from "filesize";
import toast from "react-hot-toast";

interface ImageCardProps {
  image: {
    publicId: string;
    originalSize: number;
    title: string;
  };
  onDownload: (url: string, title: string) => void;
  onDelete: (publicId: string) => void;
}

const ImageCard: React.FC<ImageCardProps> = ({
  image,
  onDownload,
  onDelete,
}) => {
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [copied, setCopied] = useState(false);

  const getThumbnailUrl = (publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 400,
      height: 225,
      crop: "fill",
      gravity: "auto",
      format: "jpg",
      quality: "auto",
    });
  };

  const getFullImageUrl = (publicId: string) => {
    return getCldImageUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  };

  const formatSize = (size: number) => {
    return filesize(size);
  };

  const handleShare = async () => {
    const imageUrl = getFullImageUrl(image.publicId);
    try {
      await navigator.clipboard.writeText(imageUrl);
      setCopied(true);
      toast.success("Shareable Link Copied to Clipboard", { duration: 3000 });
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };
  const handleDelete = async () => {
    setShowConfirmation(false);
    setIsDeleting(true);
    try {
      await onDelete(image.publicId);
    } catch (error) {
      console.error("Error deleting image:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 max-w-sm mx-auto rounded-lg">
      <figure className="relative aspect-video overflow-hidden rounded-t-lg">
        <img
          src={getThumbnailUrl(image.publicId)}
          alt={image.title}
          className="w-full h-full object-cover"
        />
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-lg font-bold">{image.title}</h2>
        <p className="text-sm text-base-content opacity-70">
          Original Size: {formatSize(image.originalSize)}
        </p>

        <div className="flex justify-between items-center mt-2">
          <div className="flex items-center space-x-4">
            <button
              className="btn btn-primary"
              style={{ padding: "5px 10px" }}
              onClick={() =>
                onDownload(getFullImageUrl(image.publicId), image.title)
              }
            >
              <Download size={16} />
            </button>

            <button
              className="btn"
              style={{ backgroundColor: "#4CAF50", padding: "5px 10px" }}
              onClick={handleShare}
            >
              <Share2 size={16} style={{ color: "white" }} />
            </button>
            <button
              className="btn"
              style={{ backgroundColor: "#D32F2F", padding: "5px 10px" }}
              onClick={() => setShowConfirmation(true)}
            >
              <Trash size={16} style={{ color: "white" }} />
            </button>
          </div>
        </div>

        {copied && (
          <p className="text-xs text-center text-green-500 mt-1">
            Shareable link copied to clipboard!
          </p>
        )}

        {showConfirmation && (
          <div className="mt-1 text-center">
            <p className="text-sm text-white">Are you sure to delete?</p>
            <div className="flex justify-center gap-2 mt-1">
              <button
                className="text-white font-medium"
                style={{
                  backgroundColor: "#3B82F6",
                  padding: "4px 12px",
                  fontSize: "13px",
                  borderRadius: "5px",
                }}
                onClick={handleDelete}
              >
                Yes
              </button>
              <button
                className="text-white font-medium"
                style={{
                  backgroundColor: "#D32F2F",
                  padding: "4px 12px",
                  fontSize: "13px",
                  borderRadius: "5px",
                }}
                onClick={() => setShowConfirmation(false)}
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {isDeleting && (
          <div className="mt-4">
            <progress className="progress progress-primary w-full" />
            <p className="text-sm text-center text-gray-500">Deleting...</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ImageCard;
