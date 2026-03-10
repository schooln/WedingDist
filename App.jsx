import { useEffect, useMemo, useRef, useState } from "react";
import "./App.scss";
import AssetLoadingScreen from "../src/components/AssetLoadingScreen";
import HeroSection from "../src/sections/HeroSection";
import InvitationSection from "../src/sections/InvitationSection";
import CoupleSection from "../src/sections/CoupleSection";
import ScheduleSection from "../src/sections/ScheduleSection";
import GallerySection from "../src/sections/GallerySection";
import WishSection from "../src/sections/WishSection";
import GiftSection from "../src/sections/GiftSection";
import FooterSection from "../src/sections/FooterSection";
import OpeningInvitation from "../src/components/OpeningInvitation";
import IntroCurtain from "../src/components/IntroCurtain";
import LinkGenerator from "../src/pages/LinkGenerator";
import motDoiAudio from "./assets/audio/motdoi.mp3";
import {
  coupleProfiles,
  familyVenues,
  footerContent,
  galleryContent,
  giftContent,
  heroContent,
  initialWishes,
  invitationMessage,
  timelineContent,
  weddingDate
} from "../src/data/siteContent";
import {
  isGeneratorView,
  parsePersonalizationFromParams,
  personalizeContentStrings
} from "../src/utils/personalization";
import { preloadWebsiteAssets } from "../src/utils/preloadAssets";

const MIN_LOADING_SCREEN_MS = 3000;
const AUDIO_STATUS = {
  PAUSED: "paused",
  LOADING: "loading",
  PLAYING: "playing",
  ERROR: "error"
};

function App() {
  const [isAssetsReady, setIsAssetsReady] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [isOpeningDone, setIsOpeningDone] = useState(false);
  const [isIntroDone, setIsIntroDone] = useState(false);
  const [showScrollHint, setShowScrollHint] = useState(false);
  const [audioStatus, setAudioStatus] = useState(AUDIO_STATUS.PAUSED);
  const audioRef = useRef(null);
  const audioRecoveryTimerRef = useRef();
  const shouldResumeAudioRef = useRef(false);
  const searchParams = useMemo(() => {
    if (typeof window === "undefined") return null;
    return new URLSearchParams(window.location.search);
  }, []);
  const personalization = useMemo(() => parsePersonalizationFromParams(searchParams), [searchParams]);
  const isGeneratorMode = useMemo(() => isGeneratorView(searchParams), [searchParams]);
  const personalizedContent = useMemo(
    () => ({
      heroContent: personalizeContentStrings(heroContent, personalization),
      invitationMessage: personalizeContentStrings(invitationMessage, personalization),
      coupleProfiles: personalizeContentStrings(coupleProfiles, personalization),
      familyVenues: personalizeContentStrings(familyVenues, personalization),
      timelineContent: personalizeContentStrings(timelineContent, personalization),
      galleryContent: personalizeContentStrings(galleryContent, personalization),
      initialWishes: personalizeContentStrings(initialWishes, personalization),
      giftContent: personalizeContentStrings(giftContent, personalization),
      footerContent: personalizeContentStrings(footerContent, personalization)
    }),
    [personalization]
  );
  const inviteBaseUrl = useMemo(() => {
    if (typeof window === "undefined") return "";
    return `${window.location.origin}${window.location.pathname}`;
  }, []);

  const clearAudioRecoveryTimer = () => {
    if (typeof window === "undefined" || !audioRecoveryTimerRef.current) return;
    window.clearTimeout(audioRecoveryTimerRef.current);
    audioRecoveryTimerRef.current = undefined;
  };

  const getAudioPlaybackStatus = (audio) => {
    if (!audio) return AUDIO_STATUS.PAUSED;
    if (audio.error) return AUDIO_STATUS.ERROR;
    if (!audio.paused && !audio.ended) {
      return audio.readyState >= 3 ? AUDIO_STATUS.PLAYING : AUDIO_STATUS.LOADING;
    }
    return AUDIO_STATUS.PAUSED;
  };

  const syncAudioPlaybackState = () => {
    const audio = audioRef.current;
    setAudioStatus(getAudioPlaybackStatus(audio));
  };

  const ensureBackgroundAudio = () => {
    if (typeof Audio === "undefined") return null;
    if (audioRef.current) return audioRef.current;

    const audio = new Audio(motDoiAudio);
    audio.loop = true;
    audio.volume = 0.4;
    audio.preload = "auto";
    audio.playsInline = true;
    audioRef.current = audio;
    return audio;
  };

  const playBackgroundAudio = async ({ reload = false } = {}) => {
    if (isGeneratorMode) return false;

    const audio = ensureBackgroundAudio();
    if (!audio) return false;

    clearAudioRecoveryTimer();
    shouldResumeAudioRef.current = true;
    setAudioStatus(AUDIO_STATUS.LOADING);

    if (audio.ended) {
      audio.currentTime = 0;
    }

    const shouldReloadSource =
      reload &&
      (
        audio.error ||
        audio.readyState === 0 ||
        (typeof audio.networkState === "number" && audio.networkState === HTMLMediaElement.NETWORK_NO_SOURCE)
      );

    if (shouldReloadSource) {
      audio.load();
    }

    try {
      const playPromise = audio.play();
      if (playPromise && typeof playPromise.then === "function") {
        await playPromise;
      }
      syncAudioPlaybackState();
      return true;
    } catch {
      syncAudioPlaybackState();
      return false;
    }
  };

  const pauseBackgroundAudio = ({ keepResumeIntent = false } = {}) => {
    clearAudioRecoveryTimer();
    shouldResumeAudioRef.current = keepResumeIntent;

    if (audioRef.current) {
      audioRef.current.pause();
    }

    setAudioStatus(AUDIO_STATUS.PAUSED);
  };

  const scheduleAudioRecovery = ({ reload = false, delayMs = 900 } = {}) => {
    if (typeof window === "undefined") return;
    if (!shouldResumeAudioRef.current) return;
    if (typeof document !== "undefined" && document.visibilityState === "hidden") return;

    clearAudioRecoveryTimer();
    audioRecoveryTimerRef.current = window.setTimeout(() => {
      if (!shouldResumeAudioRef.current) return;
      if (typeof document !== "undefined" && document.visibilityState === "hidden") return;
      void playBackgroundAudio({ reload });
    }, delayMs);
  };

  useEffect(() => {
    if (isGeneratorMode) {
      setIsAssetsReady(true);
      setLoadingProgress(100);
      return undefined;
    }

    let isCancelled = false;

    const runPreload = async () => {
      const startTime = typeof performance !== "undefined" ? performance.now() : Date.now();

      await preloadWebsiteAssets((nextProgress) => {
        if (isCancelled) return;
        setLoadingProgress(nextProgress);
      });

      const now = typeof performance !== "undefined" ? performance.now() : Date.now();
      const elapsed = now - startTime;
      const remainingDelay = Math.max(0, MIN_LOADING_SCREEN_MS - elapsed);

      if (remainingDelay > 0) {
        await new Promise((resolve) => {
          setTimeout(resolve, remainingDelay);
        });
      }

      if (isCancelled) return;
      setLoadingProgress(100);
      setIsAssetsReady(true);
    };

    void runPreload();

    return () => {
      isCancelled = true;
    };
  }, [isGeneratorMode]);

  useEffect(() => {
    if (typeof window === "undefined" || isGeneratorMode) return undefined;
    if (window.history && "scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    window.scrollTo({ top: 0, left: 0, behavior: "auto" });

    return () => {
      if (window.history && "scrollRestoration" in window.history) {
        window.history.scrollRestoration = "auto";
      }
    };
  }, [isGeneratorMode]);

  useEffect(() => {
    if (isGeneratorMode) return undefined;

    const audio = ensureBackgroundAudio();
    if (!audio) return undefined;

    const handlePlay = () => syncAudioPlaybackState();
    const handlePlaying = () => setAudioStatus(AUDIO_STATUS.PLAYING);
    const handlePause = () => {
      syncAudioPlaybackState();
      if (shouldResumeAudioRef.current) {
        scheduleAudioRecovery({ delayMs: 1200 });
      }
    };
    const handleStall = () => {
      setAudioStatus(AUDIO_STATUS.LOADING);
      scheduleAudioRecovery({ reload: true, delayMs: 700 });
    };
    const handleEnded = () => {
      setAudioStatus(AUDIO_STATUS.PAUSED);
      scheduleAudioRecovery({ delayMs: 80 });
    };
    const handleError = () => {
      setAudioStatus(AUDIO_STATUS.ERROR);
      scheduleAudioRecovery({ reload: true, delayMs: 1000 });
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("playing", handlePlaying);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("waiting", handleStall);
    audio.addEventListener("stalled", handleStall);
    audio.addEventListener("suspend", handleStall);
    audio.addEventListener("error", handleError);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("canplay", handlePlay);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("playing", handlePlaying);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("waiting", handleStall);
      audio.removeEventListener("stalled", handleStall);
      audio.removeEventListener("suspend", handleStall);
      audio.removeEventListener("error", handleError);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("canplay", handlePlay);
    };
  }, [isGeneratorMode]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return;

    if (audioStatus === AUDIO_STATUS.PLAYING) {
      navigator.mediaSession.playbackState = "playing";
      return;
    }

    if (audioStatus === AUDIO_STATUS.LOADING) {
      navigator.mediaSession.playbackState = "none";
      return;
    }

    navigator.mediaSession.playbackState = "paused";
  }, [audioStatus]);

  useEffect(() => {
    if (typeof navigator === "undefined" || !("mediaSession" in navigator)) return undefined;

    navigator.mediaSession.setActionHandler("play", () => {
      void playBackgroundAudio();
    });
    navigator.mediaSession.setActionHandler("pause", () => {
      pauseBackgroundAudio();
    });

    return () => {
      navigator.mediaSession.setActionHandler("play", null);
      navigator.mediaSession.setActionHandler("pause", null);
    };
  }, [isGeneratorMode]);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined" || isGeneratorMode) return undefined;

    const resumeIfNeeded = () => {
      if (!shouldResumeAudioRef.current) return;
      if (document.visibilityState === "hidden") return;
      if (!audioRef.current || audioRef.current.paused) {
        scheduleAudioRecovery({ delayMs: 120 });
      }
    };

    const stopRecoveryWhileHidden = () => {
      if (document.visibilityState === "hidden") {
        clearAudioRecoveryTimer();
        return;
      }
      resumeIfNeeded();
    };

    document.addEventListener("visibilitychange", stopRecoveryWhileHidden);
    window.addEventListener("pageshow", resumeIfNeeded);
    window.addEventListener("focus", resumeIfNeeded);

    return () => {
      document.removeEventListener("visibilitychange", stopRecoveryWhileHidden);
      window.removeEventListener("pageshow", resumeIfNeeded);
      window.removeEventListener("focus", resumeIfNeeded);
    };
  }, [isGeneratorMode]);

  useEffect(() => {
    return () => {
      clearAudioRecoveryTimer();
      shouldResumeAudioRef.current = false;
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current.removeAttribute("src");
        audioRef.current.load();
        audioRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (typeof window === "undefined" || typeof document === "undefined" || isGeneratorMode) return undefined;
    if (!isIntroDone) {
      setShowScrollHint(false);
      return undefined;
    }

    const handleScroll = () => {
      const body = document.body;
      const html = document.documentElement;
      const docHeight = Math.max(
        body?.scrollHeight || 0,
        body?.offsetHeight || 0,
        html?.clientHeight || 0,
        html?.scrollHeight || 0,
        html?.offsetHeight || 0
      );

      const viewportBottom = window.scrollY + window.innerHeight;
      const isAtBottom = viewportBottom >= docHeight - 40;
      setShowScrollHint(!isAtBottom);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [isIntroDone, isGeneratorMode]);

  const handleScrollHintClick = () => {
    if (typeof window === "undefined") return;
    window.scrollBy({ top: window.innerHeight, left: 0, behavior: "smooth" });
  };

  const handleStartBackgroundAudio = () => {
    void playBackgroundAudio();
  };

  const handleAudioToggle = () => {
    if (audioStatus === AUDIO_STATUS.PLAYING || audioStatus === AUDIO_STATUS.LOADING) {
      pauseBackgroundAudio();
      return;
    }

    void playBackgroundAudio();
  };

  const audioToggleLabel =
    audioStatus === AUDIO_STATUS.PLAYING
      ? "Nhạc đang bật"
      : audioStatus === AUDIO_STATUS.LOADING
        ? "Đang kết nối nhạc"
        : audioStatus === AUDIO_STATUS.ERROR
          ? "Bật lại nhạc"
          : "Bật lại nhạc";
  const audioToggleIcon =
    audioStatus === AUDIO_STATUS.PLAYING ? "♪" : audioStatus === AUDIO_STATUS.LOADING ? "…" : "×";
  const isAudioActive = audioStatus === AUDIO_STATUS.PLAYING || audioStatus === AUDIO_STATUS.LOADING;

  if (isGeneratorMode) {
    return (
      <LinkGenerator
        baseUrl={inviteBaseUrl}
        initialValues={personalization}
        coupleNames={[personalizedContent.heroContent.groom, personalizedContent.heroContent.bride]}
      />
    );
  }

  return (
    <div className="invite-shell">
      <div className={`invite-page ${isIntroDone ? "invite-page--ready" : "invite-page--locked"}`}>
        {!isAssetsReady ? (
          <AssetLoadingScreen progress={loadingProgress} />
        ) : null}

        {isAssetsReady && !isOpeningDone ? (
          <OpeningInvitation
            onComplete={() => setIsOpeningDone(true)}
            onOpenEnvelope={handleStartBackgroundAudio}
            personalization={personalization}
          />
        ) : null}

        {isAssetsReady && isOpeningDone && !isIntroDone ? (
          <IntroCurtain onDone={() => setIsIntroDone(true)} />
        ) : null}

        {isIntroDone ? (
          <>
            <button
              type="button"
              className={`scroll-hint ${showScrollHint ? "is-visible" : ""}`}
              aria-label="Cuộn xuống để xem thêm nội dung"
              onClick={handleScrollHintClick}
            >
              <span className="scroll-hint__label">Cuộn xuống để xem thêm nội dung</span>
              <span className="scroll-hint__icon" aria-hidden>
                ↓
              </span>
            </button>
            <button
              type="button"
              className={`audio-toggle ${isAudioActive ? "is-playing" : ""} ${audioStatus === AUDIO_STATUS.LOADING ? "is-loading" : ""} ${audioStatus === AUDIO_STATUS.ERROR ? "is-error" : ""}`}
              aria-label={isAudioActive ? "Tắt nhạc nền" : "Bật nhạc nền"}
              aria-pressed={isAudioActive}
              onClick={handleAudioToggle}
            >
              <span className="audio-toggle__icon" aria-hidden>
                {audioToggleIcon}
              </span>
              <span className="audio-toggle__label">{audioToggleLabel}</span>
            </button>
          </>
        ) : null}

        {isAssetsReady && isOpeningDone ? (
          <div className="invite-page__content invite-page__content--visible">
            <HeroSection content={personalizedContent.heroContent} weddingDate={weddingDate} />
            <InvitationSection content={personalizedContent.invitationMessage} />
            <ScheduleSection venues={personalizedContent.familyVenues} timeline={personalizedContent.timelineContent} />
            <CoupleSection profiles={personalizedContent.coupleProfiles} />
            <GallerySection gallery={personalizedContent.galleryContent} />
            <WishSection initialMessages={personalizedContent.initialWishes} />
            <GiftSection content={personalizedContent.giftContent} />
            <FooterSection content={personalizedContent.footerContent} />
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default App;
