export interface GradientOption {
  name: string;
  gradient: string;
}

export interface ScreenshotBgCategory {
  id: string;
  label: string;
  options: GradientOption[];
}

export const CodeSnippetBg: GradientOption[] = [
  {
    name: "Crimson Twilight",
    gradient:
      "linear-gradient( 109.6deg,  rgba(204,0,0,1) 11.2%, rgba(68,0,0,1) 100.6% )",
  },
  {
    name: "Golden Rose",
    gradient:
      "linear-gradient( 177.5deg,  rgba(255,200,42,1) 28.3%, rgba(202,32,132,1) 79.8% )",
  },
  {
    name: "Golden Oasis",
    gradient:
      "radial-gradient( circle 297px at 8% 45%,  rgba(245,234,176,1) 0%, rgba(133,239,212,1) 100.7% )",
  },
  {
    name: "Aqua Horizon",
    gradient:
      "radial-gradient( circle farthest-corner at 10% 20%,  rgba(56,207,191,1) 0%, rgba(10,70,147,1) 90.2% )",
  },
  {
    name: "Emerald Nightfall",
    gradient:
      "radial-gradient( circle farthest-corner at 96.1% 7.2%,  rgba(9,178,62,1) 0%, rgba(19,19,19,1) 100.2% )",
  },
  {
    name: "Blush Blossom",
    gradient:
      "radial-gradient( circle farthest-corner at 10% 20%,  rgba(240, 139, 139, 1) 0%, rgba(243, 252, 166, 1) 90% )",
  },
  {
    name: "Lavender Dream",
    gradient:
      "radial-gradient( circle 341px at 10% 20%,  rgba(132, 94, 194, 1) 0%, rgba(196, 243, 251, 1) 90% )",
  },
  {
    name: "Sunrise Serenade",
    gradient:
      "linear-gradient(91.7deg, rgba(135, 206, 235, 1) 7.3%, rgba(255, 154, 139, 1) 40.3%, rgba(255, 195, 160, 1) 57.9%, rgba(255, 215, 0, 1) 93.5%)",
  },
  {
    name: "Iridescent Waves",
    gradient:
      "linear-gradient(109.6deg, rgba(112, 246, 255, 0.33) 11.2%, rgba(221, 108, 241, 0.26) 42%, rgba(229, 106, 253, 0.71) 71.5%, rgba(123, 183, 253, 1) 100.2%)",
  },
  {
    name: "Prismatic Bloom",
    gradient:
      "linear-gradient(68.1deg, rgba(196, 69, 69, 1) 9.2%, rgba(255, 167, 73, 0.82) 25%, rgba(253, 217, 82, 0.82) 43.4%, rgba(107, 225, 108, 0.82) 58.2%, rgba(107, 169, 225, 0.82) 75.1%, rgba(153, 41, 243, 0.82) 87.3%)",
  },
  {
    name: "Peach Bliss",
    gradient:
      "linear-gradient(64.3deg, rgba(254, 122, 152, 0.81) 17.7%, rgba(255, 206, 134, 1) 64.7%, rgba(172, 253, 163, 0.64) 112.1%)",
  },
  {
    name: "Amber Glow",
    gradient:
      "linear-gradient(107.7deg, rgba(235, 230, 44, 0.55) 8.4%, rgba(252, 152, 15, 1) 90.3%)",
  },
  {
    name: "Ocean's Embrace",
    gradient:
      "radial-gradient(circle farthest-corner at 48.4% 47.5%, rgba(122, 183, 255, 1) 0%, rgba(21, 83, 161, 1) 90%)",
  },
  {
    name: "Celestial Spectrum",
    gradient:
      "linear-gradient(226.4deg, rgba(255, 26, 1, 1) 28.9%, rgba(254, 155, 1, 1) 33%, rgba(255, 241, 0, 1) 48.6%, rgba(34, 218, 1, 1) 65.3%, rgba(0, 141, 254, 1) 80.6%, rgba(113, 63, 254, 1) 100.1%)",
  },
  {
    name: "Silver Lining",
    gradient:
      "linear-gradient(180.3deg, rgba(221, 221, 221, 1) 5.5%, rgba(110, 136, 161, 1) 90.2%)",
  },
  {
    name: "Golden Sunset",
    gradient:
      "linear-gradient(109.6deg, rgba(255,253,208,1) 11.2%, rgba(153,102,51,1) 91%)",
  },
  {
    name: "Blackened Night",
    gradient:
      "linear-gradient(0.1deg, rgba(21, 13, 15, 1) 10.2%, rgba(21, 13, 15, 0.70) 99.8%, rgba(21, 13, 15, 0.29) 121.2%)",
  },
  {
    name: "Sunset Overdrive",
    gradient:
      "linear-gradient(97.3deg, rgba(25, 50, 70, 0.81) 10.7%, rgba(155, 65, 25, 0.72) 39.5%, rgba(255, 192, 0, 0.81) 69.7%)",
  },
  {
    name: "Red Sunset",
    gradient:
      "radial-gradient(circle farthest-corner at 10% 20%, rgba(235, 131, 130, 1) 0%, rgba(235, 131, 130, 0.75) 38.6%, rgba(211, 177, 125, 0.52) 72.1%, rgba(211, 177, 125, 0.24) 94.7%)",
  },
  {
    name: "Blue Horizon",
    gradient:
      "radial-gradient(circle 1224px at 10.6% 8.8%, rgba(255, 255, 255, 1) 0%, rgba(153, 202, 251, 1) 100.2%)",
  },
  {
    name: "Green Mist",
    gradient:
      "linear-gradient(113.7deg, rgba(90, 173, 173, 1) 16.4%, rgba(0, 0, 0, 1) 99.7%)",
  },
  {name: "black", gradient: "#000000"},
  {name: "white", gradient: "#ffffff"},
  {
    name: "macOS Space",
    gradient:
      "linear-gradient(135deg, rgba(19, 29, 45, 1) 0%, rgba(34, 47, 64, 1) 50%, rgba(49, 65, 85, 1) 100%)",
  },
  {
    name: "macOS Blue",
    gradient:
      "linear-gradient(135deg, rgba(117, 189, 255, 1) 0%, rgba(71, 160, 255, 1) 50%, rgba(0, 122, 255, 1) 100%)",
  },
  {
    name: "macOS Orange",
    gradient:
      "linear-gradient(135deg, rgba(255, 157, 73, 1) 0%, rgba(255, 127, 50, 1) 50%, rgba(255, 99, 20, 1) 100%)",
  },
  {
    name: "macOS Purple",
    gradient:
      "linear-gradient(135deg, rgba(178, 121, 255, 1) 0%, rgba(155, 89, 255, 1) 50%, rgba(139, 69, 236, 1) 100%)",
  },
  {
    name: "macOS Pink",
    gradient:
      "linear-gradient(135deg, rgba(255, 121, 172, 1) 0%, rgba(255, 96, 151, 1) 50%, rgba(255, 71, 140, 1) 100%)",
  },
  {
    name: "macOS Green",
    gradient:
      "linear-gradient(135deg, rgba(80, 180, 124, 1) 0%, rgba(52, 168, 112, 1) 50%, rgba(40, 155, 104, 1) 100%)",
  },
  {
    name: "macOS Teal",
    gradient:
      "linear-gradient(135deg, rgba(80, 200, 200, 1) 0%, rgba(50, 180, 180, 1) 50%, rgba(30, 160, 165, 1) 100%)",
  },
  {
    name: "macOS Dark Gray",
    gradient:
      "linear-gradient(135deg, rgba(60, 63, 65, 1) 0%, rgba(45, 48, 50, 1) 50%, rgba(30, 33, 35, 1) 100%)",
  },
  {
    name: "Windows 10 Blue",
    gradient:
      "linear-gradient(135deg, rgba(0, 120, 215, 1) 0%, rgba(0, 90, 158, 1) 50%, rgba(0, 60, 120, 1) 100%)",
  },
  {
    name: "Windows 11",
    gradient:
      "linear-gradient(135deg, rgba(240, 240, 240, 1) 0%, rgba(200, 200, 200, 1) 50%, rgba(180, 180, 180, 1) 100%)",
  },
  {
    name: "Windows Cyan",
    gradient:
      "linear-gradient(135deg, rgba(0, 177, 225, 1) 0%, rgba(0, 150, 200, 1) 50%, rgba(0, 120, 170, 1) 100%)",
  },
  {
    name: "Windows Purple",
    gradient:
      "linear-gradient(135deg, rgba(156, 39, 176, 1) 0%, rgba(123, 31, 162, 1) 50%, rgba(103, 58, 183, 1) 100%)",
  },
  {
    name: "Ubuntu Orange",
    gradient:
      "linear-gradient(135deg, rgba(226, 107, 41, 1) 0%, rgba(206, 87, 21, 1) 50%, rgba(186, 67, 1, 1) 100%)",
  },
  {
    name: "Fedora Blue",
    gradient:
      "linear-gradient(135deg, rgba(51, 102, 204, 1) 0%, rgba(41, 82, 184, 1) 50%, rgba(31, 62, 164, 1) 100%)",
  },
  {
    name: "Mint Green",
    gradient:
      "linear-gradient(135deg, rgba(72, 197, 142, 1) 0%, rgba(56, 177, 122, 1) 50%, rgba(40, 157, 102, 1) 100%)",
  },
  {
    name: "Debian Red",
    gradient:
      "linear-gradient(135deg, rgba(215, 23, 104, 1) 0%, rgba(195, 3, 84, 1) 50%, rgba(165, 0, 64, 1) 100%)",
  },
  {
    name: "Elementary Dark",
    gradient:
      "linear-gradient(135deg, rgba(45, 45, 45, 1) 0%, rgba(35, 35, 35, 1) 50%, rgba(25, 25, 25, 1) 100%)",
  },
  {
    name: "Warm Flame",
    gradient:
      "linear-gradient(45deg, rgba(255, 154, 158, 1) 0%, rgba(250, 208, 196, 1) 100%)",
  },
  {
    name: "Sunny Morning",
    gradient:
      "linear-gradient(120deg, rgba(246, 211, 101, 1) 0%, rgba(253, 160, 133, 1) 100%)",
  },
  {
    name: "Dusty Grass",
    gradient:
      "linear-gradient(120deg, rgba(212, 252, 121, 1) 0%, rgba(150, 230, 161, 1) 100%)",
  },
  {
    name: "Tempting Azure",
    gradient:
      "linear-gradient(120deg, rgba(132, 250, 176, 1) 0%, rgba(143, 211, 244, 1) 100%)",
  },
  {
    name: "Malibu Beach",
    gradient:
      "linear-gradient(to right, rgba(79, 172, 254, 1) 0%, rgba(0, 242, 254, 1) 100%)",
  },
  {
    name: "New Life",
    gradient:
      "linear-gradient(to right, rgba(67, 233, 123, 1) 0%, rgba(56, 249, 215, 1) 100%)",
  },
  {
    name: "True Sunset",
    gradient:
      "linear-gradient(to right, rgba(250, 112, 154, 1) 0%, rgba(254, 225, 64, 1) 100%)",
  },
  {
    name: "Morpheus Den",
    gradient:
      "linear-gradient(to top, rgba(48, 207, 208, 1) 0%, rgba(51, 8, 103, 1) 100%)",
  },
  {
    name: "Plum Plate",
    gradient:
      "linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%)",
  },
  {
    name: "Deep Blue",
    gradient:
      "linear-gradient(120deg, rgba(224, 195, 252, 1) 0%, rgba(142, 197, 252, 1) 100%)",
  },
  {
    name: "Lemon Gate",
    gradient:
      "linear-gradient(to top, rgba(150, 251, 196, 1) 0%, rgba(249, 245, 134, 1) 100%)",
  },
  {
    name: "Itmeo Branding",
    gradient:
      "linear-gradient(180deg, rgba(42, 245, 152, 1) 0%, rgba(0, 158, 253, 1) 100%)",
  },
  {
    name: "Night Party",
    gradient:
      "linear-gradient(to top, rgba(2, 80, 197, 1) 0%, rgba(212, 63, 141, 1) 100%)",
  },
  {
    name: "Sky Glider",
    gradient:
      "linear-gradient(to top, rgba(136, 211, 206, 1) 0%, rgba(110, 69, 226, 1) 100%)",
  },
  {
    name: "Aqua Splash",
    gradient:
      "linear-gradient(15deg, rgba(19, 84, 122, 1) 0%, rgba(128, 208, 199, 1) 100%)",
  },
  {
    name: "Summer Games",
    gradient:
      "linear-gradient(to right, rgba(146, 254, 157, 1) 0%, rgba(0, 201, 255, 1) 100%)",
  },
  {
    name: "Phoenix Start",
    gradient:
      "linear-gradient(to right, rgba(248, 54, 0, 1) 0%, rgba(249, 212, 35, 1) 100%)",
  },
  {
    name: "October Silence",
    gradient:
      "linear-gradient(-20deg, rgba(183, 33, 255, 1) 0%, rgba(33, 212, 253, 1) 100%)",
  },
  {
    name: "Hidden Jaguar",
    gradient:
      "linear-gradient(to top, rgba(15, 216, 80, 1) 0%, rgba(249, 240, 71, 1) 100%)",
  },
  {
    name: "Seashore",
    gradient:
      "linear-gradient(to top, rgba(32, 156, 255, 1) 0%, rgba(104, 224, 207, 1) 100%)",
  },
  {
    name: "Magic Lake",
    gradient:
      "linear-gradient(to top, rgba(213, 222, 231, 1) 0%, rgba(255, 170, 189, 1) 50%, rgba(201, 255, 191, 1) 100%)",
  },
  {
    name: "North Miracle",
    gradient:
      "linear-gradient(to right, rgba(0, 219, 222, 1) 0%, rgba(252, 0, 255, 1) 100%)",
  },
  {
    name: "High Flight",
    gradient:
      "linear-gradient(to right, rgba(10, 207, 254, 1) 0%, rgba(73, 90, 255, 1) 100%)",
  },
];

export const ScreenShotSnippetBg: GradientOption[] = [
  {
    name: "Crimson Twilight",
    gradient:
      "linear-gradient( 109.6deg,  rgba(204,0,0,1) 11.2%, rgba(68,0,0,1) 100.6% )",
  },
  {
    name: "Golden Rose",
    gradient:
      "linear-gradient( 177.5deg,  rgba(255,200,42,1) 28.3%, rgba(202,32,132,1) 79.8% )",
  },
  {
    name: "Golden Oasis",
    gradient:
      "radial-gradient( circle 297px at 8% 45%,  rgba(245,234,176,1) 0%, rgba(133,239,212,1) 100.7% )",
  },
  {
    name: "Aqua Horizon",
    gradient:
      "radial-gradient( circle farthest-corner at 10% 20%,  rgba(56,207,191,1) 0%, rgba(10,70,147,1) 90.2% )",
  },
  {
    name: "Emerald Nightfall",
    gradient:
      "radial-gradient( circle farthest-corner at 96.1% 7.2%,  rgba(9,178,62,1) 0%, rgba(19,19,19,1) 100.2% )",
  },
  {
    name: "Blush Blossom",
    gradient:
      "radial-gradient( circle farthest-corner at 10% 20%,  rgba(240, 139, 139, 1) 0%, rgba(243, 252, 166, 1) 90% )",
  },
  {
    name: "Lavender Dream",
    gradient:
      "radial-gradient( circle 341px at 10% 20%,  rgba(132, 94, 194, 1) 0%, rgba(196, 243, 251, 1) 90% )",
  },
  {
    name: "Sunrise Serenade",
    gradient:
      "linear-gradient(91.7deg, rgba(135, 206, 235, 1) 7.3%, rgba(255, 154, 139, 1) 40.3%, rgba(255, 195, 160, 1) 57.9%, rgba(255, 215, 0, 1) 93.5%)",
  },
  {
    name: "Iridescent Waves",
    gradient:
      "linear-gradient(109.6deg, rgba(112, 246, 255, 0.33) 11.2%, rgba(221, 108, 241, 0.26) 42%, rgba(229, 106, 253, 0.71) 71.5%, rgba(123, 183, 253, 1) 100.2%)",
  },
  {
    name: "Prismatic Bloom",
    gradient:
      "linear-gradient(68.1deg, rgba(196, 69, 69, 1) 9.2%, rgba(255, 167, 73, 0.82) 25%, rgba(253, 217, 82, 0.82) 43.4%, rgba(107, 225, 108, 0.82) 58.2%, rgba(107, 169, 225, 0.82) 75.1%, rgba(153, 41, 243, 0.82) 87.3%)",
  },
  {
    name: "Peach Bliss",
    gradient:
      "linear-gradient(64.3deg, rgba(254, 122, 152, 0.81) 17.7%, rgba(255, 206, 134, 1) 64.7%, rgba(172, 253, 163, 0.64) 112.1%)",
  },
  {
    name: "Amber Glow",
    gradient:
      "linear-gradient(107.7deg, rgba(235, 230, 44, 0.55) 8.4%, rgba(252, 152, 15, 1) 90.3%)",
  },
  {
    name: "Ocean's Embrace",
    gradient:
      "radial-gradient(circle farthest-corner at 48.4% 47.5%, rgba(122, 183, 255, 1) 0%, rgba(21, 83, 161, 1) 90%)",
  },
  {
    name: "Celestial Spectrum",
    gradient:
      "linear-gradient(226.4deg, rgba(255, 26, 1, 1) 28.9%, rgba(254, 155, 1, 1) 33%, rgba(255, 241, 0, 1) 48.6%, rgba(34, 218, 1, 1) 65.3%, rgba(0, 141, 254, 1) 80.6%, rgba(113, 63, 254, 1) 100.1%)",
  },
  {
    name: "Silver Lining",
    gradient:
      "linear-gradient(180.3deg, rgba(221, 221, 221, 1) 5.5%, rgba(110, 136, 161, 1) 90.2%)",
  },
  {
    name: "Golden Sunset",
    gradient:
      "linear-gradient(109.6deg, rgba(255,253,208,1) 11.2%, rgba(153,102,51,1) 91%)",
  },
  {
    name: "Blackened Night",
    gradient:
      "linear-gradient(0.1deg, rgba(21, 13, 15, 1) 10.2%, rgba(21, 13, 15, 0.70) 99.8%, rgba(21, 13, 15, 0.29) 121.2%)",
  },
  {
    name: "Sunset Overdrive",
    gradient:
      "linear-gradient(97.3deg, rgba(25, 50, 70, 0.81) 10.7%, rgba(155, 65, 25, 0.72) 39.5%, rgba(255, 192, 0, 0.81) 69.7%)",
  },
  {
    name: "Red Sunset",
    gradient:
      "radial-gradient(circle farthest-corner at 10% 20%, rgba(235, 131, 130, 1) 0%, rgba(235, 131, 130, 0.75) 38.6%, rgba(211, 177, 125, 0.52) 72.1%, rgba(211, 177, 125, 0.24) 94.7%)",
  },
  {
    name: "Blue Horizon",
    gradient:
      "radial-gradient(circle 1224px at 10.6% 8.8%, rgba(255, 255, 255, 1) 0%, rgba(153, 202, 251, 1) 100.2%)",
  },
  {
    name: "Green Mist",
    gradient:
      "linear-gradient(113.7deg, rgba(90, 173, 173, 1) 16.4%, rgba(0, 0, 0, 1) 99.7%)",
  },
  {name: "black", gradient: "#000000"},
  {name: "white", gradient: "#ffffff"},
  {
    name: "macOS Space",
    gradient:
      "linear-gradient(135deg, rgba(19, 29, 45, 1) 0%, rgba(34, 47, 64, 1) 50%, rgba(49, 65, 85, 1) 100%)",
  },
  {
    name: "macOS Blue",
    gradient:
      "linear-gradient(135deg, rgba(117, 189, 255, 1) 0%, rgba(71, 160, 255, 1) 50%, rgba(0, 122, 255, 1) 100%)",
  },
  {
    name: "macOS Orange",
    gradient:
      "linear-gradient(135deg, rgba(255, 157, 73, 1) 0%, rgba(255, 127, 50, 1) 50%, rgba(255, 99, 20, 1) 100%)",
  },
  {
    name: "macOS Purple",
    gradient:
      "linear-gradient(135deg, rgba(178, 121, 255, 1) 0%, rgba(155, 89, 255, 1) 50%, rgba(139, 69, 236, 1) 100%)",
  },
  {
    name: "macOS Pink",
    gradient:
      "linear-gradient(135deg, rgba(255, 121, 172, 1) 0%, rgba(255, 96, 151, 1) 50%, rgba(255, 71, 140, 1) 100%)",
  },
  {
    name: "macOS Green",
    gradient:
      "linear-gradient(135deg, rgba(80, 180, 124, 1) 0%, rgba(52, 168, 112, 1) 50%, rgba(40, 155, 104, 1) 100%)",
  },
  {
    name: "macOS Teal",
    gradient:
      "linear-gradient(135deg, rgba(80, 200, 200, 1) 0%, rgba(50, 180, 180, 1) 50%, rgba(30, 160, 165, 1) 100%)",
  },
  {
    name: "macOS Dark Gray",
    gradient:
      "linear-gradient(135deg, rgba(60, 63, 65, 1) 0%, rgba(45, 48, 50, 1) 50%, rgba(30, 33, 35, 1) 100%)",
  },
  {
    name: "Windows 10 Blue",
    gradient:
      "linear-gradient(135deg, rgba(0, 120, 215, 1) 0%, rgba(0, 90, 158, 1) 50%, rgba(0, 60, 120, 1) 100%)",
  },
  {
    name: "Windows 11",
    gradient:
      "linear-gradient(135deg, rgba(240, 240, 240, 1) 0%, rgba(200, 200, 200, 1) 50%, rgba(180, 180, 180, 1) 100%)",
  },
  {
    name: "Windows Cyan",
    gradient:
      "linear-gradient(135deg, rgba(0, 177, 225, 1) 0%, rgba(0, 150, 200, 1) 50%, rgba(0, 120, 170, 1) 100%)",
  },
  {
    name: "Windows Purple",
    gradient:
      "linear-gradient(135deg, rgba(156, 39, 176, 1) 0%, rgba(123, 31, 162, 1) 50%, rgba(103, 58, 183, 1) 100%)",
  },
  {
    name: "Ubuntu Orange",
    gradient:
      "linear-gradient(135deg, rgba(226, 107, 41, 1) 0%, rgba(206, 87, 21, 1) 50%, rgba(186, 67, 1, 1) 100%)",
  },
  {
    name: "Fedora Blue",
    gradient:
      "linear-gradient(135deg, rgba(51, 102, 204, 1) 0%, rgba(41, 82, 184, 1) 50%, rgba(31, 62, 164, 1) 100%)",
  },
  {
    name: "Mint Green",
    gradient:
      "linear-gradient(135deg, rgba(72, 197, 142, 1) 0%, rgba(56, 177, 122, 1) 50%, rgba(40, 157, 102, 1) 100%)",
  },
  {
    name: "Debian Red",
    gradient:
      "linear-gradient(135deg, rgba(215, 23, 104, 1) 0%, rgba(195, 3, 84, 1) 50%, rgba(165, 0, 64, 1) 100%)",
  },
  {
    name: "Elementary Dark",
    gradient:
      "linear-gradient(135deg, rgba(45, 45, 45, 1) 0%, rgba(35, 35, 35, 1) 50%, rgba(25, 25, 25, 1) 100%)",
  },
  {
    name: "Warm Flame",
    gradient:
      "linear-gradient(45deg, rgba(255, 154, 158, 1) 0%, rgba(250, 208, 196, 1) 100%)",
  },
  {
    name: "Sunny Morning",
    gradient:
      "linear-gradient(120deg, rgba(246, 211, 101, 1) 0%, rgba(253, 160, 133, 1) 100%)",
  },
  {
    name: "Dusty Grass",
    gradient:
      "linear-gradient(120deg, rgba(212, 252, 121, 1) 0%, rgba(150, 230, 161, 1) 100%)",
  },
  {
    name: "Tempting Azure",
    gradient:
      "linear-gradient(120deg, rgba(132, 250, 176, 1) 0%, rgba(143, 211, 244, 1) 100%)",
  },
  {
    name: "Malibu Beach",
    gradient:
      "linear-gradient(to right, rgba(79, 172, 254, 1) 0%, rgba(0, 242, 254, 1) 100%)",
  },
  {
    name: "New Life",
    gradient:
      "linear-gradient(to right, rgba(67, 233, 123, 1) 0%, rgba(56, 249, 215, 1) 100%)",
  },
  {
    name: "True Sunset",
    gradient:
      "linear-gradient(to right, rgba(250, 112, 154, 1) 0%, rgba(254, 225, 64, 1) 100%)",
  },
  {
    name: "Morpheus Den",
    gradient:
      "linear-gradient(to top, rgba(48, 207, 208, 1) 0%, rgba(51, 8, 103, 1) 100%)",
  },
  {
    name: "Plum Plate",
    gradient:
      "linear-gradient(135deg, rgba(102, 126, 234, 1) 0%, rgba(118, 75, 162, 1) 100%)",
  },
  {
    name: "Deep Blue",
    gradient:
      "linear-gradient(120deg, rgba(224, 195, 252, 1) 0%, rgba(142, 197, 252, 1) 100%)",
  },
  {
    name: "Lemon Gate",
    gradient:
      "linear-gradient(to top, rgba(150, 251, 196, 1) 0%, rgba(249, 245, 134, 1) 100%)",
  },
  {
    name: "Itmeo Branding",
    gradient:
      "linear-gradient(180deg, rgba(42, 245, 152, 1) 0%, rgba(0, 158, 253, 1) 100%)",
  },
  {
    name: "Night Party",
    gradient:
      "linear-gradient(to top, rgba(2, 80, 197, 1) 0%, rgba(212, 63, 141, 1) 100%)",
  },
  {
    name: "Sky Glider",
    gradient:
      "linear-gradient(to top, rgba(136, 211, 206, 1) 0%, rgba(110, 69, 226, 1) 100%)",
  },
  {
    name: "Aqua Splash",
    gradient:
      "linear-gradient(15deg, rgba(19, 84, 122, 1) 0%, rgba(128, 208, 199, 1) 100%)",
  },
  {
    name: "Summer Games",
    gradient:
      "linear-gradient(to right, rgba(146, 254, 157, 1) 0%, rgba(0, 201, 255, 1) 100%)",
  },
  {
    name: "Phoenix Start",
    gradient:
      "linear-gradient(to right, rgba(248, 54, 0, 1) 0%, rgba(249, 212, 35, 1) 100%)",
  },
  {
    name: "October Silence",
    gradient:
      "linear-gradient(-20deg, rgba(183, 33, 255, 1) 0%, rgba(33, 212, 253, 1) 100%)",
  },
  {
    name: "Hidden Jaguar",
    gradient:
      "linear-gradient(to top, rgba(15, 216, 80, 1) 0%, rgba(249, 240, 71, 1) 100%)",
  },
  {
    name: "Seashore",
    gradient:
      "linear-gradient(to top, rgba(32, 156, 255, 1) 0%, rgba(104, 224, 207, 1) 100%)",
  },
  {
    name: "Magic Lake",
    gradient:
      "linear-gradient(to top, rgba(213, 222, 231, 1) 0%, rgba(255, 170, 189, 1) 50%, rgba(201, 255, 191, 1) 100%)",
  },
  {
    name: "North Miracle",
    gradient:
      "linear-gradient(to right, rgba(0, 219, 222, 1) 0%, rgba(252, 0, 255, 1) 100%)",
  },
  {
    name: "High Flight",
    gradient:
      "linear-gradient(to right, rgba(10, 207, 254, 1) 0%, rgba(73, 90, 255, 1) 100%)",
  },
];

export const ScreenshotSnippetBgCategories: ScreenshotBgCategory[] = [
  {
    id: "abstract",
    label: "Abstract",
    options: [
      {
        name: "Aurora",
        gradient:
          "center / cover no-repeat url('/backgrounds/abstract/abstract-aurora.svg')",
      },
      {
        name: "Dune",
        gradient:
          "center / cover no-repeat url('/backgrounds/abstract/abstract-dune.svg')",
      },
      {
        name: "Lagoon",
        gradient:
          "center / cover no-repeat url('/backgrounds/abstract/abstract-lagoon.svg')",
      },
      {
        name: "Nebula",
        gradient:
          "center / cover no-repeat url('/backgrounds/abstract/abstract-nebula.svg')",
      },
      {
        name: "Candy Waves",
        gradient:
          "center / cover no-repeat url('/backgrounds/abstract/abstract-candy.svg')",
      },
      {
        name: "Prism Flow",
        gradient:
          "center / cover no-repeat url('/backgrounds/abstract/abstract-prism.svg')",
      },
      {
        name: "Ember Field",
        gradient:
          "center / cover no-repeat url('/backgrounds/abstract/abstract-ember.svg')",
      },
      {
        name: "Ice Flow",
        gradient:
          "center / cover no-repeat url('/backgrounds/abstract/abstract-iceflow.svg')",
      },
      {
        name: "Mirage",
        gradient:
          "center / cover no-repeat url('/backgrounds/abstract/abstract-mirage.svg')",
      },
      {
        name: "Orbit",
        gradient:
          "center / cover no-repeat url('/backgrounds/abstract/abstract-orbit.svg')",
      },
    ],
  },
  {
    id: "magic",
    label: "Magic Gradients",
    options: [
      {
        name: "Tangerine Ring",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(255, 88, 14, 0) 24%, rgba(255, 88, 14, 0.95) 36%, rgba(255, 88, 14, 0.12) 54%, rgba(28, 29, 33, 1) 62%)",
      },
      {
        name: "Mint Pulse",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(12, 224, 175, 0.9) 0%, rgba(12, 224, 175, 0.14) 30%, rgba(24, 25, 29, 1) 60%)",
      },
      {
        name: "Lava Core",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(255, 92, 17, 0.95) 0%, rgba(255, 92, 17, 0.18) 30%, rgba(13, 14, 18, 1) 62%)",
      },
      {
        name: "Aqua Glow",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(107, 214, 255, 0.82) 0%, rgba(107, 214, 255, 0.14) 32%, rgba(30, 31, 36, 1) 62%)",
      },
      {
        name: "Amber Ring",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(236, 165, 54, 0) 22%, rgba(236, 165, 54, 0.9) 36%, rgba(236, 165, 54, 0.14) 54%, rgba(30, 31, 35, 1) 64%)",
      },
      {
        name: "Azure Core",
        gradient:
          "radial-gradient(circle at 50% 50%, rgba(98, 210, 255, 0.82) 0%, rgba(98, 210, 255, 0.15) 32%, rgba(15, 16, 20, 1) 64%)",
      },

      {
        name: "Raycast Eclipse",
        gradient:
          "radial-gradient(ellipse at 52% 46%, rgba(255, 255, 255, 0) 30%, rgba(255, 255, 255, 0.4) 35%, rgba(255, 255, 255, 0.14) 45%, rgba(20, 22, 28, 1) 65%)",
      },
      {
        name: "Raycast Ring",
        gradient:
          "radial-gradient(ellipse at 53% 48%, rgba(255, 88, 126, 0) 35%, rgba(255, 88, 126, 0.78) 44%, rgba(255, 88, 126, 0.18) 51%, rgba(23, 25, 31, 1) 68%)",
      },
      {
        name: "Raycast Bloom",
        gradient:
          "radial-gradient(ellipse at 45% 40%, rgba(255, 122, 171, 0.95) 0%, rgba(255, 122, 171, 0.2) 24%, rgba(20, 22, 28, 1) 62%), radial-gradient(circle at 70% 45%, rgba(255, 255, 255, 0.2) 0%, rgba(20, 22, 28, 0) 30%)",
      },
      {
        name: "Raycast Halo",
        gradient:
          "radial-gradient(ellipse at 50% 40%, rgba(190, 117, 255, 0.95) 0%, rgba(143, 87, 255, 0.28) 30%, rgba(16, 17, 23, 1) 65%)",
      },
    ],
  },
  {
    id: "raycast",
    label: "Raycast",
    options: [
      {
        name: "Chromatic Dark 1",
        gradient:
          "center / cover no-repeat url('/backgrounds/raycast-gradient/chromatic_dark_1.webp')",
      },
      {
        name: "Chromatic Dark 2",
        gradient:
          "center / cover no-repeat url('/backgrounds/raycast-gradient/chromatic_dark_2.webp')",
      },
      {
        name: "Chromatic Light 1",
        gradient:
          "center / cover no-repeat url('/backgrounds/raycast-gradient/chromatic_light_1.webp')",
      },
      {
        name: "Chromatic Light 2",
        gradient:
          "center / cover no-repeat url('/backgrounds/raycast-gradient/chromatic_light_2.webp')",
      },
      {
        name: "Mono Dark Distortion 1",
        gradient:
          "center / cover no-repeat url('/backgrounds/raycast-gradient/mono_dark_distortion_1.webp')",
      },
      {
        name: "Mono Dark Distortion 2",
        gradient:
          "center / cover no-repeat url('/backgrounds/raycast-gradient/mono_dark_distortion_2.webp')",
      },
      {
        name: "Red Distortion 4",
        gradient:
          "center / cover no-repeat url('/backgrounds/raycast-gradient/red_distortion_4.webp')",
      },
      {
        name: "Raycast Motion",
        gradient:
          "repeating-linear-gradient(145deg, rgba(255, 90, 88, 0.78) 0 8px, rgba(10, 12, 18, 1) 8px 18px), radial-gradient(circle at 80% 20%, rgba(255, 255, 255, 0.25) 0%, rgba(10, 12, 18, 0) 30%)",
      },

      {
        name: "Raycast Mono Grid",
        gradient:
          "repeating-linear-gradient(145deg, rgba(220, 220, 220, 0.45) 0 8px, rgba(14, 16, 21, 1) 8px 18px)",
      },

      {
        name: "Raycast Carbon",
        gradient:
          "repeating-linear-gradient(145deg, rgba(255, 255, 255, 0.12) 0 7px, rgba(10, 12, 18, 1) 7px 16px)",
      },
      {
        name: "Raycast Drift",
        gradient:
          "repeating-linear-gradient(145deg, rgba(30, 33, 39, 0.4) 0 8px, rgba(221, 224, 228, 0.95) 8px 18px)",
      },
    ],
  },
  {
    id: "macos",
    label: "MacBook",
    options: [
      {
        name: "Mac Studio 1",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-1.webp')",
      },
      {
        name: "Mac Studio 2",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-2.webp')",
      },
      {
        name: "Mac Studio 3",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-3.webp')",
      },
      {
        name: "Mac Studio 4",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-4.webp')",
      },
      {
        name: "Mac Studio 5",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-5.webp')",
      },
      {
        name: "Mac Studio 6",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-6.webp')",
      },
      {
        name: "Mac Studio 7",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-7.webp')",
      },
      {
        name: "Mac Studio 8",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-8.webp')",
      },
      {
        name: "Mac Studio 9",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-9.webp')",
      },
      {
        name: "Mac Studio 10",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-10.webp')",
      },
      {
        name: "Mac Studio 11",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-11.webp')",
      },
      {
        name: "Mac Studio 12",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-12.webp')",
      },
      {
        name: "Mac Studio 13",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-13.webp')",
      },
      {
        name: "Mac Studio 14",
        gradient:
          "center / cover no-repeat url('/backgrounds/macos/mac-bg-14.webp')",
      },
    ],
  },
  {
    id: "windows",
    label: "Windows",
    options: [
      {
        name: "Windows Studio 1",
        gradient:
          "center / cover no-repeat url('/backgrounds/windows/windows-bg-1.png')",
      },
      {
        name: "Windows Studio 2",
        gradient:
          "center / cover no-repeat url('/backgrounds/windows/windows-bg-2.png')",
      },
      {
        name: "Windows Studio 3",
        gradient:
          "center / cover no-repeat url('/backgrounds/windows/windows-bg-3.png')",
      },
      {
        name: "Windows Studio 4",
        gradient:
          "center / cover no-repeat url('/backgrounds/windows/windows-bg-4.jpg')",
      },
    ],
  },
  {
    id: "linux",
    label: "Linux",
    options: [
      {
        name: "Ubuntu",
        gradient:
          "center / cover no-repeat url('/backgrounds/linux/linux-ubuntu.svg')",
      },
      {
        name: "Fedora",
        gradient:
          "center / cover no-repeat url('/backgrounds/linux/linux-fedora.svg')",
      },
      {
        name: "Mint",
        gradient:
          "center / cover no-repeat url('/backgrounds/linux/linux-mint.svg')",
      },
      {
        name: "Arch",
        gradient:
          "center / cover no-repeat url('/backgrounds/linux/linux-arch.svg')",
      },
    ],
  },
  {
    id: "gradient",
    label: "Gradients",
    options: [
      ...CodeSnippetBg.map((item) => ({
        name: item.name,
        gradient: item.gradient,
      })),
    ],
  },
  {
    id: "radiant",
    label: "Radiant",
    options: [
      {
        name: "Radiant 1",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant1.jpg')",
      },
      {
        name: "Radiant 2",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant2.jpg')",
      },
      {
        name: "Radiant 4",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant4.jpg')",
      },
      {
        name: "Radiant 5",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant5.jpg')",
      },
      {
        name: "Radiant 6",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant6.jpg')",
      },
      {
        name: "Radiant 7",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant7.avif')",
      },
      {
        name: "Radiant 8",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant8.jpg')",
      },
      {
        name: "Radiant 9",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant9.jpg')",
      },
      {
        name: "Radiant 10",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant10.jpg')",
      },
      {
        name: "Radiant 11",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant11.svg')",
      },
      {
        name: "Radiant 12",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant12.svg')",
      },
      {
        name: "Radiant 13",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant13.svg')",
      },
      {
        name: "Radiant 14",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant14.svg')",
      },
      {
        name: "Radiant 15",
        gradient:
          "center / cover no-repeat url('/backgrounds/radiant/radiant15.svg')",
      },
    ],
  },
  {
    id: "mesh",
    label: "Mesh",
    options: [
      {
        name: "Mesh 1",
        gradient:
          "center / cover no-repeat url('/backgrounds/mesh-bg/mesh1.webp')",
      },
      {
        name: "Mesh 2",
        gradient:
          "center / cover no-repeat url('/backgrounds/mesh-bg/mesh2.webp')",
      },
      {
        name: "Mesh 3",
        gradient:
          "center / cover no-repeat url('/backgrounds/mesh-bg/mesh3.webp')",
      },
      {
        name: "Mesh 4",
        gradient:
          "center / cover no-repeat url('/backgrounds/mesh-bg/mesh4.webp')",
      },
      {
        name: "Mesh 5",
        gradient:
          "center / cover no-repeat url('/backgrounds/mesh-bg/mesh5.webp')",
      },
      {
        name: "Mesh 6",
        gradient:
          "center / cover no-repeat url('/backgrounds/mesh-bg/mesh6.webp')",
      },
      {
        name: "Mesh 7",
        gradient:
          "center / cover no-repeat url('/backgrounds/mesh-bg/mesh7.webp')",
      },
      {
        name: "Mesh 8",
        gradient:
          "center / cover no-repeat url('/backgrounds/mesh-bg/mesh8.webp')",
      },
    ],
  },
];
