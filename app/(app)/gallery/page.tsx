"use client";
import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import VideoCard from "@/component/VideoCard";
import ImageCard from "@/component/ImageCard";
import { Video } from "@/types/video";
import { Image } from "@/types/image";

function Home() {
  const [videos, setVideos] = useState<Video[]>([]);
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<"videos" | "images">(
    "videos"
  ); // State to track active category

  const fetchVideos = useCallback(async () => {
    try {
      const response = await axios.get("/api/videos");
      if (Array.isArray(response.data)) {
        setVideos(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch videos");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchImages = useCallback(async () => {
    try {
      const response = await axios.get("/api/images");
      if (Array.isArray(response.data)) {
        setImages(response.data);
      } else {
        throw new Error("Unexpected response format");
      }
    } catch (error) {
      console.log(error);
      setError("Failed to fetch images");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchVideos();
  }, []);

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDownload = useCallback((url: string, title: string) => {
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${title}.mp4`);
    link.setAttribute("target", "_blank");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }, []);

  const handleDelete = useCallback(
    async (publicId: string) => {
      try {
        const response = await axios.delete("/api/video-delete", {
          data: { publicId },
        });
        if (response.status === 200) {
          setVideos(videos.filter((video) => video.publicId !== publicId));
          toast.success("Video deleted successfully");
        } else {
          toast.error(response.data.error || "Failed to delete video");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete video");
      }
    },
    [videos]
  );

  const handleDeleteImage = useCallback(
    async (publicId: string) => {
      try {
        const response = await axios.delete("/api/image-delete", {
          data: { publicId },
        });
        if (response.status === 200) {
          setImages((prevImages) =>
            prevImages.filter((image) => image.publicId !== publicId)
          );
          toast.success("Image deleted successfully");
        } else {
          toast.error(response.data.error || "Failed to delete image");
        }
      } catch (error) {
        console.log(error);
        toast.error("Failed to delete image");
      }
    },
    [images]
  );

  const toggleCategory = (category: "videos" | "images") => {
    setActiveCategory(category);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">{error}</div>;
  }

  return (
    <div>
      {/* Category buttons to switch between Videos and Images */}
      <div className="flex justify-center space-x-4 mb-6">
        <button
          onClick={() => toggleCategory("videos")}
          className={`px-3 py-1.5 text-md rounded-md font-semibold ${
            activeCategory === "videos"
              ? "bg-blue-500 text-white border-2 border-blue-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Videos
        </button>
        <button
          onClick={() => toggleCategory("images")}
          className={`px-3 py-1.5 text-md rounded-md font-semibold ${
            activeCategory === "images"
              ? "bg-blue-500 text-white border-2 border-blue-700"
              : "bg-gray-200 text-gray-700"
          }`}
        >
          Images
        </button>
      </div>

      {/* Render content based on selected category */}
      {activeCategory === "videos" && (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Videos</h1>
          {videos.length === 0 ? (
            <div className="text-center text-lg text-gray-500">
              No videos available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((video) => (
                <VideoCard
                  key={video.publicId}
                  video={video}
                  onDownload={handleDownload}
                  onDelete={handleDelete}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {activeCategory === "images" && (
        <div className="container mx-auto p-4">
          <h1 className="text-2xl font-bold mb-4">Images</h1>
          {images.length === 0 ? (
            <div className="text-center text-lg text-gray-500">
              No images available
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((image) => (
                <ImageCard
                  key={image.publicId}
                  image={image}
                  onDownload={handleDownload}
                  onDelete={handleDeleteImage}
                />
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default Home;
