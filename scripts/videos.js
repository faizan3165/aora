import { ID, Query } from "react-native-appwrite";

import { databases, config, storage } from "../lib/appwrite";

const { databaseId, videoCollectionId, storageId } = config;

export async function getAllPosts() {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
    ]);

    return posts;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getTrendingPosts() {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.orderDesc("$createdAt"),
      Query.limit(7),
    ]);

    return posts;
  } catch (error) {
    throw new Error(error);
  }
}

export async function searchVideos(query) {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.search("title", query),
      Query.limit(7),
    ]);

    return posts;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserPosts(userId) {
  try {
    const posts = await databases.listDocuments(databaseId, videoCollectionId, [
      Query.equal("creator", userId),
    ]);

    return posts;
  } catch (error) {
    throw new Error(error);
  }
}

export async function getUserSavedPosts(userId) {
  try {
    const allPosts = await databases.listDocuments(
      databaseId,
      videoCollectionId
    );

    // Filter posts locally
    const savedPosts = allPosts.documents.filter((post) =>
      post.likedBy.includes(userId)
    );

    return savedPosts;
  } catch (error) {
    throw new Error(error);
  }
}

export async function uploadFile(file, type) {
  if (!file) return;

  const asset = {
    name: file.fileName,
    type: file.mimeType,
    size: file.fileSize,
    uri: file.uri,
  };

  try {
    const uploadedFile = await storage.createFile(
      storageId,
      ID.unique(),
      asset
    );

    const fileUrl = await getFilePreview(uploadedFile?.$id, type);
    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

// Get File Preview
export async function getFilePreview(fileId, type) {
  let fileUrl;

  try {
    if (type === "video") {
      fileUrl = storage.getFileView(storageId, fileId);
    } else if (type === "image") {
      fileUrl = storage.getFilePreview(
        storageId,
        fileId,
        2000,
        2000,
        "top",
        100
      );
    } else {
      throw new Error("Invalid file type");
    }

    if (!fileUrl) throw Error;

    return fileUrl;
  } catch (error) {
    throw new Error(error);
  }
}

export async function createVideo(data) {
  try {
    const [thumbnailUrl, videoUrl] = await Promise.all([
      uploadFile(data.thumbnail, "image"),
      uploadFile(data.video, "video"),
    ]);

    const newPost = await databases.createDocument(
      databaseId,
      videoCollectionId,
      ID.unique(),
      {
        title: data.title,
        prompt: data.prompt,
        thumbnail: thumbnailUrl,
        video: videoUrl,
        creator: data.userId,
      }
    );

    return newPost;
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function deleteVideo(videoId) {
  try {
    const videoDocument = await databases.getDocument(
      databaseId,
      videoCollectionId,
      videoId
    );

    if (!videoDocument) throw new Error("Video not found");

    const { video, thumbnail } = videoDocument;

    const videoFileId = getFileIdFromUrl(video);
    const thumbnailFileId = getFileIdFromUrl(thumbnail);

    await Promise.all([
      storage.deleteFile(storageId, videoFileId),
      storage.deleteFile(storageId, thumbnailFileId),
    ]);

    await databases.deleteDocument(databaseId, videoCollectionId, videoId);
  } catch (error) {
    throw new Error(error.message);
  }
}

// Helper function to extract file ID from URL
function getFileIdFromUrl(url) {
  const match = url.match(/files\/([^\/]*)\//);
  return match ? match[1] : null;
}

export async function saveVideo(videoId, userId) {
  try {
    const video = await databases.getDocument(
      databaseId,
      videoCollectionId,
      videoId
    );
    const likedBy = video.likedBy || [];

    if (!likedBy.includes(userId)) {
      likedBy.push(userId);
    }

    await databases.updateDocument(databaseId, videoCollectionId, videoId, {
      likedBy,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}

export async function unSaveVideo(videoId, userId) {
  try {
    const video = await databases.getDocument(
      databaseId,
      videoCollectionId,
      videoId
    );
    const likedBy = video.likedBy || [];

    const updatedLikedBy = likedBy.filter((id) => id === userId);

    await databases.updateDocument(databaseId, videoCollectionId, videoId, {
      likedBy: updatedLikedBy,
    });
  } catch (error) {
    throw new Error(error.message);
  }
}
