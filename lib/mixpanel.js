"use client";

import mixpanel from "mixpanel-browser";

const MIXPANEL_TOKEN = "1fe8b247e46011b70f06eb81eebe2bc9";

if (typeof window !== "undefined") {
  mixpanel.init(MIXPANEL_TOKEN, {
    debug: true,
    track_pageview: true,
    persistence: "localStorage",
  });
}

export default mixpanel;
