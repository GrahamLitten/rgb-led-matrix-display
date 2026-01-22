# RGB Dot Matrix Desk Display

A beautiful 64x32 RGB LED matrix display project for Raspberry Pi, with an elegant web-based simulator for testing code before deployment.

## ✨ Features

- **64x32 Full RGB LED Matrix Simulator** - Realistic LED glow effects with millions of colors
- **Animated Weather Icons** - Beautiful pixel art icons for different weather conditions
- **Real-time Weather Display** - Live weather data for NYC (zip code 10038)
- **Hourly Forecast Timeline** - Shows weather predictions for +3hr, +6hr, and +12hr
- **Elegant Two-Section Layout** - Current weather on top, forecast timeline below
- **Compact Mini Icons** - Tiny weather icons for forecast boxes
- **Smart Layout** - Everything fits perfectly within 64x32 pixels with no cutoff
- **Elegant Design** - Modern UI following best design practices
- **Auto-refresh** - Updates weather every 10 minutes automatically
- **GitHub Pages Deployment** - Test and share your display online

## Quick Start

1. Clone this repository
2. Open `index.html` in your web browser
3. The simulator will display the weather for NYC

## Future Plans

- Deploy to Raspberry Pi with RGB LED matrix
- Add more display modes (clock, notifications, etc.)
- Custom animations and transitions

## 🎨 Display Layout

### Top Section (Current Weather)
- **NYC** label with location indicator
- Weather icon (6x6 pixel art, scaled)
- Large temperature display with °F indicator
- Current condition text (e.g., "SUNNY", "OVRCAST")

### Divider
- Elegant gradient line separating sections

### Bottom Section (Forecast Timeline)
- **"NEXT"** label indicating forecast section
- Three forecast boxes showing:
  - **3H** - 3 hours ahead
  - **6H** - 6 hours ahead  
  - **12** - 12 hours ahead
- Each box displays:
  - Time label
  - Mini weather icon (4x4 pixels)
  - Predicted temperature

### Color Design
- Weather-specific color palettes
- Full RGB spectrum with smooth gradients
- Icon colors: yellows for sun, blues for rain, whites for snow, grays for clouds
- Temperature in warm orange/peach tones
- Forecast labels in soft blue/purple

## 🛠️ Hardware

- **64x32 RGB LED Matrix Panel** (2.5mm pitch - ID:5036)
- **Raspberry Pi** (any model with GPIO)
- **Power Supply** (5V 4A recommended for LED matrix)
- **RGB Matrix HAT** (optional but recommended for Raspberry Pi)

## License

MIT
