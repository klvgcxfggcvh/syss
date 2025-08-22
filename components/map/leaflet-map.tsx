"use client"

import dynamic from "next/dynamic"

export const LeafletMap = dynamic(
  () => import("./leaflet-map-inner").then((m) => m.LeafletMapInner),
  { ssr: false }
)
