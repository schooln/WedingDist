import cashRegisterAudio from "../assets/audio/cashRegister.mp3";
import motDoiAudio from "../assets/audio/motdoi.mp3";
import appBackdrop from "../assets/img_source/to1.jpg?url";
import coupleBackdrop from "../assets/img_source/to2.jpg?url";
import footerBackdrop from "../assets/img_source/to3.jpg?url";
import galleryBackdrop from "../assets/img_source/nho1.jpg?url";
import giftBackdrop from "../assets/img_source/nho2.jpg?url";
import heroBackdrop from "../assets/img_source/to1.jpg?url";
import invitationBackdrop from "../assets/img_source/nho3.jpg?url";
import scheduleBackdrop from "../assets/img_source/nho4.jpg?url";
import sideBackdropLeft from "../assets/img_source/nho6.jpg?url";
import sideBackdropRight from "../assets/img_source/nho7.jpg?url";
import wishBackdrop from "../assets/img_source/nho5.jpg?url";
import { coupleProfiles, galleryContent, giftContent, heroContent } from "../src/data/siteContent";

const IMAGE_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif", ".gif", ".svg"];
const AUDIO_EXTENSIONS = [".mp3", ".wav", ".ogg", ".m4a", ".aac"];
const MIN_PROGRESS = 0;
const MAX_PROGRESS = 100;
const PRELOAD_AUDIO_TIMEOUT_MS = 15000;
const PRELOAD_CONCURRENCY = 6;

const collectAssetUrls = (value, matcher, results = []) => {
  if (!value) return results;

  if (typeof value === "string") {
    if (matcher(value)) {
      results.push(value);
    }
    return results;
  }

  if (Array.isArray(value)) {
    value.forEach((item) => collectAssetUrls(item, matcher, results));
    return results;
  }

  if (typeof value === "object") {
    Object.values(value).forEach((nestedValue) => collectAssetUrls(nestedValue, matcher, results));
  }

  return results;
};

const stripQuery = (url) => url.split("?")[0].toLowerCase();
const isAudioAsset = (url) => AUDIO_EXTENSIONS.some((ext) => stripQuery(url).endsWith(ext));
const isImageAsset = (url) => IMAGE_EXTENSIONS.some((ext) => stripQuery(url).endsWith(ext));

const LOCAL_ASSET_URLS = Array.from(
  new Set(
    [
      appBackdrop,
      heroBackdrop,
      invitationBackdrop,
      coupleBackdrop,
      scheduleBackdrop,
      galleryBackdrop,
      wishBackdrop,
      giftBackdrop,
      sideBackdropLeft,
      sideBackdropRight,
      footerBackdrop,
      ...collectAssetUrls([heroContent, coupleProfiles, galleryContent, giftContent], isImageAsset),
      motDoiAudio,
      cashRegisterAudio
    ].filter(Boolean)
  )
);

const preloadImage = (url) =>
  new Promise((resolve) => {
    if (typeof Image === "undefined") {
      resolve();
      return;
    }

    const image = new Image();
    const finalize = () => resolve();

    image.onload = finalize;
    image.onerror = finalize;
    image.decoding = "async";
    image.src = url;
  });

const preloadAudio = (url) =>
  new Promise((resolve) => {
    if (typeof Audio === "undefined") {
      resolve();
      return;
    }

    const audio = new Audio();
    let timeoutId;

    const finalize = () => {
      audio.removeEventListener("canplay", finalize);
      audio.removeEventListener("canplaythrough", finalize);
      audio.removeEventListener("loadeddata", finalize);
      audio.removeEventListener("error", finalize);
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      resolve();
    };

    audio.preload = "auto";
    audio.addEventListener("canplay", finalize, { once: true });
    audio.addEventListener("canplaythrough", finalize, { once: true });
    audio.addEventListener("loadeddata", finalize, { once: true });
    audio.addEventListener("error", finalize, { once: true });
    audio.src = url;
    audio.load();
    timeoutId = setTimeout(finalize, PRELOAD_AUDIO_TIMEOUT_MS);
  });

const preloadAsset = (url) => {
  if (isAudioAsset(url)) return preloadAudio(url);
  if (isImageAsset(url)) return preloadImage(url);
  return Promise.resolve();
};

const runWithConcurrency = async (tasks, limit) => {
  if (tasks.length === 0) return;

  let cursor = 0;
  const worker = async () => {
    while (cursor < tasks.length) {
      const currentIndex = cursor;
      cursor += 1;
      await tasks[currentIndex]();
    }
  };

  const workers = Array.from({ length: Math.min(limit, tasks.length) }, () => worker());
  await Promise.all(workers);
};

const toProgress = (loaded, total) => {
  if (!total) return MAX_PROGRESS;
  const percent = Math.round((loaded / total) * MAX_PROGRESS);
  return Math.min(MAX_PROGRESS, Math.max(MIN_PROGRESS, percent));
};

export const preloadWebsiteAssets = async (onProgress) => {
  const totalAssets = LOCAL_ASSET_URLS.length;
  if (totalAssets === 0) {
    onProgress?.(MAX_PROGRESS);
    return;
  }

  let loadedAssets = 0;
  onProgress?.(MIN_PROGRESS);

  const tasks = LOCAL_ASSET_URLS.map((assetUrl) => async () => {
    try {
      await preloadAsset(assetUrl);
    } catch {
      // Continue loading remaining assets even when one asset fails.
    } finally {
      loadedAssets += 1;
      onProgress?.(toProgress(loadedAssets, totalAssets));
    }
  });

  await runWithConcurrency(tasks, PRELOAD_CONCURRENCY);
  onProgress?.(MAX_PROGRESS);
};
