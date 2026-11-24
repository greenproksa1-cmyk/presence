"use client";

import { useEffect, useRef, useState } from "react";
import { Camera, CameraOff } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ScannerControls {
  stop: () => void;
}

export function QrScanner({
  onDetected,
  labels,
}: {
  onDetected: (value: string) => void;
  labels: { startCamera: string; stopCamera: string; cameraError: string };
}) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const controlsRef = useRef<ScannerControls | null>(null);
  const [active, setActive] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function stop() {
    controlsRef.current?.stop();
    controlsRef.current = null;
    setActive(false);
  }

  async function start() {
    if (active) return;
    setError(null);
    try {
      const { BrowserQRCodeReader } = await import("@zxing/browser");
      const reader = new BrowserQRCodeReader();
      const video = videoRef.current;
      if (!video) return;

      const controls = await reader.decodeFromVideoDevice(undefined, video, (result) => {
        const text = result?.getText();
        if (!text) return;
        controlsRef.current?.stop();
        controlsRef.current = null;
        setActive(false);
        onDetected(text);
      });
      controlsRef.current = controls;
      setActive(true);
    } catch (reason) {
      console.error("[check-in] camera unavailable", reason);
      setError(labels.cameraError);
    }
  }

  useEffect(() => {
    return () => {
      controlsRef.current?.stop();
    };
  }, []);

  return (
    <div className="space-y-3">
      <div className="relative overflow-hidden rounded-xl border border-border bg-navy-950">
        <video
          ref={videoRef}
          className="aspect-video w-full object-cover"
          muted
          playsInline
          aria-label={labels.startCamera}
        />
        {!active ? (
          <div className="absolute inset-0 flex items-center justify-center bg-navy-950/85 text-center text-[0.75rem] text-white/70">
            {error ?? labels.startCamera}
          </div>
        ) : null}
      </div>
      <Button
        type="button"
        variant={active ? "outline" : "gold"}
        onClick={active ? stop : start}
        className="w-full gap-2"
      >
        {active ? (
          <CameraOff className="h-4 w-4" aria-hidden="true" />
        ) : (
          <Camera className="h-4 w-4" aria-hidden="true" />
        )}
        {active ? labels.stopCamera : labels.startCamera}
      </Button>
    </div>
  );
}
