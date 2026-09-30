"use client";

import { useEffect, useState } from "react";
import { defaultEventState, EVENT_CHANNEL, EVENT_STATE_KEY, EventState, readEventState } from "@/lib/event-store";

export function useEventState() {
  const [state, setState] = useState<EventState>(defaultEventState);

  useEffect(() => {
    setState(readEventState());
    const sync = (event?: Event) => {
      if (event instanceof CustomEvent) setState(event.detail as EventState);
      else setState(readEventState());
    };
    window.addEventListener(EVENT_CHANNEL, sync);
    const onStorage = (event: StorageEvent) => { if (event.key === EVENT_STATE_KEY) sync(); };
    window.addEventListener("storage", onStorage);
    return () => { window.removeEventListener(EVENT_CHANNEL, sync); window.removeEventListener("storage", onStorage); };
  }, []);

  return state;
}
