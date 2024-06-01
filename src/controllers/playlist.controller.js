import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";
import { ApiResponse } from "../utils/ApiResponse.js";
import { Playlist } from "../models/playlist.model.js";
import { Video } from "../models/video.model.js";
import mongoose, { isValidObjectId } from "mongoose";

const createPlaylist = asyncHandler(async (req, res) => {
  const { name, description } = req.body;

  if (!name || !description) {
    throw new ApiError(400, "Name and description is required.");
  }

  const playlist = await Playlist.create({
    name,
    description,
    owner: req.user?.id,
  });

  if (!playlist) {
    throw new ApiError(500, "Something went wrong while making playlist.");
  }

  return res
    .status(200)
    .json(new ApiResponse(200, playlist, "Playlist created successfully"));
});

const addVideoToPlaylist = asyncHandler(async (req, res) => {
  const { videoId, playlistId } = req.params;

  if (!isValidObjectId(videoId) || !isValidObjectId(playlistId)) {
    throw new ApiError(400, "Provided playlist or video is invalid");
  }

  const playlist = await Playlist.findById(playlistId);
  if (!playlist) {
    throw new ApiError(404, "Playlist not found!!");
  }

  const video = await Video.findById(videoId);
  if (!video) {
    throw new ApiError(404, "Video not found!!");
  }

  const updatedPlaylist = await Playlist.findByIdAndUpdate(
    playlist?._id,
    {
      $addToSet: {
        videos: video?._id,
      },
    },
    {
      new: true,
    }
  );

  if (!updatedPlaylist) {
    throw new ApiError(500, "Something went wrong while adding the video");
  }

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        updatedPlaylist,
        "Video added to playlist successfully"
      )
    );
});

export { createPlaylist, addVideoToPlaylist };
