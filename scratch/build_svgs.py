import os
import subprocess

# Create KTU Logo SVG string
ktu_logo_svg = '''<svg width="100" height="110" viewBox="0 0 100 110" xmlns="http://www.w3.org/2000/svg">
  <path d="M10 10 H90 V70 C90 90 50 105 50 105 C50 105 10 90 10 70 Z" fill="#ffffff" stroke="#004080" stroke-width="3"/>
  <path d="M14 14 H86 V68 C86 85 50 99 50 99 C50 99 14 85 14 68 Z" fill="#e6f0fa" stroke="#004080" stroke-width="1.5"/>
  <rect x="20" y="20" width="60" height="12" fill="#004080" rx="2"/>
  <text x="50" y="28" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="#ffffff" text-anchor="middle">APJ ABDUL KALAM</text>
  <text x="50" y="34" font-family="Arial, sans-serif" font-size="4.5" fill="#004080" text-anchor="middle" font-weight="bold">TECHNOLOGICAL UNIVERSITY</text>
  <!-- Gear / Sun emblem -->
  <circle cx="50" cy="54" r="14" fill="#d97706" stroke="#b45309" stroke-width="1"/>
  <circle cx="50" cy="54" r="9" fill="#ffffff"/>
  <!-- Book emblem -->
  <path d="M42 56 Q50 51 50 56 Q50 51 58 56 V49 Q50 45 42 49 Z" fill="#004080"/>
  <text x="50" y="76" font-family="Arial, sans-serif" font-size="14" font-weight="900" fill="#004080" text-anchor="middle">KTU</text>
  <rect x="38" y="80" width="24" height="8" fill="#d97706" rx="2"/>
  <text x="50" y="86" font-family="Arial, sans-serif" font-size="6" font-weight="bold" fill="#ffffff" text-anchor="middle">2014</text>
</svg>'''

# Create MEA College Logo SVG string
mea_logo_svg = '''<svg width="110" height="110" viewBox="0 0 120 120" xmlns="http://www.w3.org/2000/svg">
  <!-- Outer gear -->
  <circle cx="60" cy="50" r="36" fill="none" stroke="#1e293b" stroke-width="4"/>
  <!-- Gear teeth -->
  <g stroke="#1e293b" stroke-width="4" stroke-linecap="round">
    <line x1="60" y1="10" x2="60" y2="18"/>
    <line x1="60" y1="82" x2="60" y2="90"/>
    <line x1="20" y1="50" x2="28" y2="50"/>
    <line x1="92" y1="50" x2="100" y2="50"/>
    <line x1="32" y1="22" x2="38" y2="28"/>
    <line x1="82" y1="72" x2="88" y2="78"/>
    <line x1="32" y1="78" x2="38" y2="72"/>
    <line x1="82" y1="28" x2="88" y2="22"/>
  </g>
  <circle cx="60" cy="50" r="30" fill="#ffffff" stroke="#1e293b" stroke-width="2"/>
  <!-- Book inside gear -->
  <path d="M46 44 Q60 38 60 44 Q60 38 74 44 V34 Q60 30 46 34 Z" fill="#0284c7"/>
  <!-- Stylized M -->
  <path d="M40 68 L50 36 L60 52 L70 36 L80 68" fill="none" stroke="#0f172a" stroke-width="5" stroke-linejoin="round" stroke-linecap="round"/>
  <!-- Ribbon banner -->
  <path d="M20 90 L30 84 H90 L100 90 L95 102 L90 98 H30 L25 102 Z" fill="#0f172a"/>
  <text x="60" y="93" font-family="Arial, sans-serif" font-size="5.5" font-weight="bold" fill="#ffffff" text-anchor="middle">MEA ENGINEERING COLLEGE</text>
  <text x="60" y="106" font-family="Arial, sans-serif" font-size="4.5" font-style="italic" fill="#0f172a" text-anchor="middle">KNOWLEDGE IS POWER</text>
</svg>'''

print("Logos SVG defined successfully.")
