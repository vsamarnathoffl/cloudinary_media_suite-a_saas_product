# Cloudinary Media Suite - A SaaS Product

Cloudinary Media Suite is a powerful SaaS solution for effortless media management and transformation. Built on Next.js and powered by Cloudinary, this project allows users to upload, manage, and transform images and videos seamlessly.

## Features

- **User Authentication**: Secure login and sign-up via Clerk.
- **Gallery**: Display uploaded images and videos, categorized for easy browsing.
- **Image Studio**: Upload and edit images with various transformation options (Instagram, Twitter, Facebook formats).
- **Video Upload**: Upload videos, select quality, and preview compression results.
- **Media Actions**: Download, share, or delete media files with user confirmation.

## Tech Stack

- **Frontend**: Next.js, React, TailwindCSS, DaisyUI
- **Backend**: Node.js, MongoDB, Mongoose
- **Authentication**: Clerk
- **Cloud Service**: Cloudinary for image and video transformations
- **Other**: Axios, DayJS, React Hot Toast

## Project Structure

## 📂 Directory Structure

```plaintext
cloudinary-saas/
├── app/                     # Frontend files and logic
│   ├── app/                 # App-specific frontend logic
│   │   ├── gallery.tsx      # Gallery page to display media
│   │   ├── image-studio.tsx # Image manipulation studio page
│   │   ├── video-upload.tsx # Video upload page
│   │   └── layout.tsx       # Global layout for the app
│   ├── auth/                # Authentication-related components and pages (Powered by Clerk)
│   │   ├── sign-in.tsx      # Sign-in page
│   │   └── sign-up.tsx      # Sign-up page
│   ├── api/                 # Backend API logic
│   │   ├── image-delete.ts  # API to delete an image
│   │   ├── image-upload.ts  # API to upload an image
│   │   ├── images.ts        # API to get all images
│   │   ├── video-delete.ts  # API to delete a video
│   │   ├── video-upload.ts  # API to upload a video
│   │   └── videos.ts        # API to get all videos
├── component/               # Reusable UI components
│   ├── ImageCard.tsx        # Image card component for displaying images
│   └── VideoCard.tsx        # Video card component for displaying videos
├── dbConfig/                # Database configuration
│   └── dbConfig.ts          # Mongoose database connection
├── models/                  # Database models
│   ├── imageModel.js        # Image model schema
│   └── videoModel.js        # Video model schema
├── types/                   # TypeScript types for the app
│   ├── image.ts             # Image type definitions
│   └── video.ts             # Video type definitions
```
## Installation

To get started with this project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/your-username/cloudinary-saas.git
   
2. Install the dependencies:

    ```bash
    cd cloudinary-saas
    npm install
    ```
3. Create a ```.env``` file in the root directory and add the following environment variables:

  ```plaintext
  NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your-cloudinary-cloud-name
  CLOUDINARY_API_KEY=your-cloudinary-api-key
  CLOUDINARY_API_SECRET=your-cloudinary-api-secret
  MONGODB_URI=your-mongo-db-connection-string
  ```
4. Create a ```.env.local``` file in the root directory and add the following environment variables:
  ```plaintext
  NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your-clerk-publishable-key
  CLERK_SECRET_KEY=your-clerk-secret-key
  NEXT_PUBLIC_CLERK_SIGN_IN_URL = /sign-in
  NEXT_PUBLIC_CLERK_SIGN_UP_URL = /sign-up
  ```
5. Run the development server:
  
  ```bash
  npm run dev
  ```
6. Open your browser and visit ```http://localhost:3000```

## Usage

### Sign Up / Log In
- If you don’t have an account, sign up.
- If you already have one, log in using Clerk.

### Gallery
- View your uploaded images and videos.
- Tap to browse by category (images or videos).

### Image Studio
- Upload and transform images.
- Choose from pre-set transformation options (Instagram, Twitter, Facebook).

### Video Upload
- Upload a video.
- Select the quality.
- Preview the uploaded media in the gallery.

## Media Actions

For both images and videos, there will be three options for each media item:

- **Download**: Open in a new tab for full preview and download.
- **Share**: Copy the media link to the clipboard.
- **Delete**: Ask for user confirmation before deleting the media.

## Contributing

We welcome contributions to improve Cloudinary Media Suite. To contribute:

1. Fork the repository.
2. Create a new branch (`git checkout -b feature-name`).
3. Make your changes.
4. Commit your changes (`git commit -am 'Add feature'`).
5. Push to the branch (`git push origin feature-name`).
6. Create a new Pull Request.

## Acknowledgements

- **Cloudinary** for media transformation services.
- **Clerk** for authentication.
- **Next.js** for building the application.

