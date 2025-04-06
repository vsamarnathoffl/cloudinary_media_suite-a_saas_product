import React, { useState } from "react";
import { getCldImageUrl, getCldVideoUrl } from "next-cloudinary";
import { Download, Clock, FileDown, FileUp, Trash, Share2 } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { filesize } from "filesize";
import { Video } from "@/types/video";
import toast from "react-hot-toast";

dayjs.extend(relativeTime);

interface VideoCardProps {
  video: Video;
  onDownload: (url: string, title: string) => void;
  onDelete: (publicId: string) => void;
}

const VideoCard: React.FC<VideoCardProps> = ({
  video,
  onDownload,
  onDelete,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [previewError, setPreviewError] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
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
      assetType: "video",
    });
  };

  const getFullVideoUrl = (publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 1920,
      height: 1080,
    });
  };

  const getPreviewVideoUrl = (publicId: string) => {
    return getCldVideoUrl({
      src: publicId,
      width: 400,
      height: 225,
      rawTransformations: ["e_preview:duration_15:max_seg_9:min_seg_dur_1"],
    });
  };

  const formatSize = (size: number) => {
    return filesize(size);
  };

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const compressionPercentage = Math.round(
    (1 - Number(video.compressedSize) / Number(video.originalSize)) * 100
  );

  const handlePreviewError = () => {
    setPreviewError(true);
  };

  const handleDelete = async () => {
    setShowConfirmation(false);
    setIsDeleting(true);
    try {
      await onDelete(video.publicId);
    } catch (error) {
      console.error("Error deleting video:", error);
    } finally {
      setIsDeleting(false);
    }
  };

  const handleShare = async () => {
    const videoUrl = getFullVideoUrl(video.publicId);
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      toast.success("Shareable Link Copied to Clipboard",{duration:3000});
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy link:", err);
    }
  };

  return (
    <div
      className="card bg-base-100 shadow-xl hover:shadow-2xl transition-all duration-300 max-w-sm mx-auto rounded-lg"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <figure className="relative aspect-video overflow-hidden rounded-t-lg">
        {isHovered ? (
          previewError ? (
            <div className="w-full h-full flex items-center justify-center bg-gray-200">
              <p className="text-red-500">Preview not available</p>
            </div>
          ) : (
            <video
              src={getPreviewVideoUrl(video.publicId)}
              autoPlay
              muted
              loop
              className="w-full h-full object-cover"
              onError={handlePreviewError}
            />
          )
        ) : (
          <img
            src={getThumbnailUrl(video.publicId)}
            alt={video.title}
            className="w-full h-full object-cover"
          />
        )}

        <div
          style={{
            position: "absolute",
            bottom: "8px",
            right: "8px",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            padding: "2px 6px",
            borderRadius: "4px",
            fontSize: "12px",
            display: "flex",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <Clock size={12} style={{ marginRight: "4px" }} />
          {formatDuration(video.duration)}
        </div>
      </figure>

      <div className="card-body p-4">
        <h2 className="card-title text-lg font-bold">{video.title}</h2>
        <p className="text-sm text-base-content opacity-70 mb-2">
          {video.description}
        </p>
        <p className="text-sm text-base-content opacity-70 ">
          Uploaded {dayjs(video.createdAt).fromNow()}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            fontSize: "13px",
            width: "100%",
            margin: "6px 0",
            padding: "8px 12px",
            backgroundColor: "rgba(0, 0, 0, 0.6)",
            borderRadius: "8px",
            color: "white",
            gap: "25px",
            fontWeight: 500,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileUp size={32} color="#90CAF9" />
            <span>Original: {formatSize(Number(video.originalSize))}</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <FileDown size={32} color="#A5D6A7" />
            <span>Compressed: {formatSize(Number(video.compressedSize))}</span>
          </div>
        </div>

        <div className="flex justify-between items-center mt-2">
          <div className="text-sm font-semibold">
            Compression:{" "}
            <span className="text-accent">{compressionPercentage}%</span>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="btn btn-primary"
              style={{ padding: "5px 10px" }}
              onClick={() =>
                onDownload(getFullVideoUrl(video.publicId), video.title)
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

export default VideoCard;
