# RGB Dot Matrix Desk Display

A beautiful 64x32 RGB LED matrix display project for Raspberry Pi, with an elegant web-based simulator for testing code before deployment.

## ✨ Features

- **64x32 Full RGB LED Matrix Simulator** - Realistic LED glow effects with millions of colors
- **Multi-Screen System** - Switch between different display modes with elegant buttons
- **Weather Display** - Live weather data for NYC (zip code 10038) with beautiful pixel art icons
- **MLB Standings** - Real-time NL East standings from MLB Stats API
- **Subway Times** - Uptown A train departures from Fulton Street station with color-coded urgency
- **Perfect Fit** - All content guaranteed to fit within 32 rows and 64 columns
- **Pixel Counter Guides** - Row and column markers outside the canvas for development
- **Elegant Design** - Modern UI following best design practices
- **Auto-refresh** - Updates data every 10 minutes automatically
- **GitHub Pages Deployment** - Test and share your display online

## Quick Start

1. Clone this repository
2. Open `index.html` in your web browser
3. The simulator will display the weather for NYC

## Future Plans

- Deploy to Raspberry Pi with RGB LED matrix
- Add more display modes (clock, notifications, etc.)
- Custom animations and transitions

## 🎨 Display Screens

### Screen 1: Weather Display
**Layout (fits rows 0-31):**
- Row 1: NYC label (top right)
- Rows 2-9: Large weather icon (8x8) + Temperature
- Rows 11-17: Condition text (centered)
- Row 19: Divider line
- Rows 21-27: "FEELS" + feels-like temperature
- Rows 29-31: Humidity indicator

**Colors:**
- Weather icons: Condition-specific colors (yellows for sun, blues for rain, grays for clouds)
- Temperature: Warm orange/peach tones
- Text: Soft blues and purples

### Screen 2: MLB NL East Standings
**Layout (fits rows 0-31):**
- Rows 0-6: "NL EAST" title
- Rows 8-14: Team 1 (first place in green)
- Rows 15-21: Team 2
- Rows 22-28: Team 3
  - Format: [TEAM] [W-L] [GB#]
  - Shows top 3 teams only (proper spacing requires 7 rows minimum per line)

**Data Source:** MLB Stats API (real-time standings)

### Screen 3: Subway A Train Departures
**Layout (fits rows 0-31):**
- Rows 0-6: "A FULTON" header with "UP" indicator
- Rows 9-15: Train 1
- Rows 16-22: Train 2
- Rows 23-29: Train 3
  - Format: [#] [TIME] [UP]
  - Shows next 3 trains (proper spacing requires 7 rows minimum per line)
  
**Color Coding:**
- Red: Arriving now (0-1 min)
- Yellow: Arriving soon (2-5 min)
- Green: Normal arrival (6+ min)

**Station:** Fulton Street (Uptown A trains)
**Note:** Currently uses mock data for demo. Live MTA data integration ready for API key.

## 📏 Technical Details

**Display Constraints:**
- Matrix size: 64 columns × 32 rows
- Font: Custom 3×5 pixel font (compact and readable)
- Text height: 5 pixels per line
- Line spacing: 1 blank row between lines (6 pixels total per line)
- Maximum displayable lines: 5 lines with proper spacing
- Character width: ~4 pixels per character (3px + 1px spacing)

## 🛠️ Hardware

- **64x32 RGB LED Matrix Panel** (2.5mm pitch - ID:5036)
- **Raspberry Pi** (any model with GPIO)
- **Power Supply** (5V 4A recommended for LED matrix)
- **RGB Matrix HAT** (optional but recommended for Raspberry Pi)

## License

MIT
