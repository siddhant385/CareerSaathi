"use client";

import { useEffect, useRef, useState } from "react";
import { VRMScene } from "./vrm-scene";

type LoadState = "loading" | "ready" | "error";

export function AvatarPreview() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadState, setLoadState] = useState<LoadState>("loading");

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const scene = new VRMScene(canvas);
    scene.load("/avatar.vrm").then(
      () => setLoadState("ready"),
      () => setLoadState("error"),
    );

    return () => scene.dispose();
  }, []);

  return (
    <main className="flex min-h-screen items-center justify-center bg-muted p-6">
      <section className="relative h-[32rem] w-full max-w-md overflow-hidden rounded-lg bg-background shadow-sm">
        <canvas ref={canvasRef} className="size-full" />
        {loadState !== "ready" && (
          <p className="absolute inset-x-0 bottom-6 text-center text-sm text-muted-foreground">
            {loadState === "loading" ? "Loading avatar…" : "Unable to load the avatar."}
          </p>
        )}
      </section>
    </main>
  );
}
