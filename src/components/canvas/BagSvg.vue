<template>
  <div class="w-full h-full relative overflow-hidden"
       style="background: linear-gradient(148deg, #f7f2eb, #e6ddd0)">
    <svg
      width="100%" height="100%"
      viewBox="0 0 280 320"
      xmlns="http://www.w3.org/2000/svg"
      class="absolute top-0 left-0 pointer-events-none"
    >
      <defs>
        <linearGradient id="bg1" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%"   stop-color="#f7f2eb"/>
          <stop offset="100%" stop-color="#e4d8cb"/>
        </linearGradient>
        <linearGradient id="hg1" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stop-color="#c0b09c"/>
          <stop offset="100%" stop-color="#a8907a"/>
        </linearGradient>
        <linearGradient id="sh1" x1="0" y1="0" x2=".3" y2="1">
          <stop offset="0%"  stop-color="#fff" stop-opacity=".22"/>
          <stop offset="60%" stop-color="#fff" stop-opacity="0"/>
        </linearGradient>
      </defs>
      <path d="M84,52 Q84,8 140,8 Q196,8 196,52"
            stroke="url(#hg1)" stroke-width="12" fill="none" stroke-linecap="round"/>
      <rect x="16" y="52" width="248" height="256" rx="6"
            fill="url(#bg1)" stroke="#c2b3a0" stroke-width="1.2"/>
      <rect x="16" y="52" width="248" height="256" rx="6"
            fill="url(#sh1)" opacity=".55"/>
      <line x1="16"  y1="92"  x2="264" y2="92"  stroke="#bfaf9a" stroke-width=".8"  opacity=".45"/>
      <line x1="16"  y1="212" x2="264" y2="212" stroke="#bfaf9a" stroke-width=".7"  opacity=".35"/>
      <line x1="16"  y1="308" x2="264" y2="308" stroke="#b8a892" stroke-width="1.1" opacity=".4"/>
      <line x1="16"  y1="52"  x2="16"  y2="308" stroke="#b8a892" stroke-width="1.1" opacity=".38"/>
      <line x1="264" y1="52"  x2="264" y2="308" stroke="#b8a892" stroke-width="1.1" opacity=".38"/>
    </svg>
  </div>
</template>
