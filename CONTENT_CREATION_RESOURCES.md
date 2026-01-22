# 64x32 LED Matrix Content Creation Resources

A curated list of tools and sources for creating custom screens for your RGB LED matrix display.

## 🎨 Pixel Art & Sprite Editors

### Online Tools (Free)

1. **Piskel** - https://www.piskelapp.com/
   - Free online sprite editor
   - Create animations frame by frame
   - Export as PNG or sprite sheets
   - Set canvas to 64x32 for perfect sizing
   - Great for icons and animated graphics

2. **Lospec Pixel Editor** - https://apps.lospec.com/pixel-editor/
   - Simple, browser-based
   - Good for quick mockups
   - Custom canvas sizes
   - Color palette support

3. **Pixilart** - https://www.pixilart.com/draw
   - Online pixel art tool
   - Community gallery for inspiration
   - Animation support
   - Export options for frames

### Desktop Tools (More Features)

4. **Aseprite** ($19.99 or compile free) - https://www.aseprite.org/
   - Professional pixel art tool
   - Animation timeline
   - Onion skinning
   - Export sprite sheets
   - Industry standard for pixel art

5. **GIMP** (Free) - https://www.gimp.org/
   - Set canvas to 64x32 pixels
   - Zoom in 1000% to draw pixels
   - Export frames as images

## 📝 Text & Marquee Generators

### LED Matrix Specific

6. **LED Matrix Studio** - http://maximumoctopus.com/electronics/builder.htm
   - Design LED matrix displays
   - Text scrolling simulation
   - Multiple matrix sizes supported
   - Export code

7. **Custom Text Generator**
   - Use your existing 3x5 font in `script.js`
   - Just call: `matrix.drawText('YOUR TEXT', x, y, r, g, b)`
   - Already supports all letters, numbers, basic symbols

## 🖼️ Image Converters

### Convert Photos/Images to 64x32

8. **Image Magick** (Command line)
   ```bash
   # Resize any image to 64x32
   convert input.jpg -resize 64x32! -depth 8 output.png
   ```

9. **Online Image Resizer** - https://www.iloveimg.com/resize-image
   - Upload image
   - Set to 64x32 pixels exact
   - Download and sample pixels

10. **LED Matrix Image Converter**
    - Photopea.com (free Photoshop alternative)
    - Resize to 64x32
    - Use "Index Color" mode for LED-friendly palette
    - Export as PNG

## 🎬 Animation Tools

### Create Scrolling & Animated Content

11. **Your Existing Codebase**
    - The simulator already supports animations
    - Use `requestAnimationFrame()` for smooth scrolling
    - Example: Scroll text across display

12. **LED Matrix Simulator** - https://led-matrix-simulator.web.app/
    - Browser-based simulator
    - Test animations before deployment
    - Export frame data

## 📊 Data Visualization Ideas

### Additional Screen Ideas You Can Implement

13. **Stock Ticker**
    - API: https://www.alphavantage.co/documentation/ (free)
    - Show stock prices scrolling

14. **Crypto Prices**
    - API: https://api.coingecko.com/api/v3/simple/price
    - BTC, ETH prices

15. **Calendar/Events**
    - Google Calendar API
    - Show today's events

16. **Traffic/Commute Times**
    - Google Maps Distance Matrix API
    - Show commute time to work

17. **News Headlines**
    - NewsAPI: https://newsapi.org/
    - Scrolling headlines

18. **Sports Scores**
    - ESPN API or TheSportsDB: https://www.thesportsdb.com/api.php
    - Live game scores

19. **Spotify Now Playing**
    - Spotify Web API
    - Show current track

20. **GitHub Contributions**
    - GitHub API
    - Your commit activity

## 🎮 Game Screens

### Retro Game Aesthetics

21. **Pong**
    - Simple game that fits 64x32 perfectly
    - Classic arcade look

22. **Snake**
    - Draw snake game on matrix
    - Control via keyboard

23. **Tetris**
    - Mini Tetris implementation
    - Perfect for 64x32 grid

## 🌐 Community Resources

### Inspiration & Examples

24. **GitHub Topics**
    - Search: "RGB matrix 64x32"
    - Hundreds of projects with code
    - Weather displays [1](https://github.com/jkeychan/rpi-zero-weather-clock-rgb-led-matrix)
    - Transit boards [2](https://github.com/benarnav/arrivals-board)
    - Weather clocks [3](https://github.com/jake1164/pico-rgb-matrix-weather-clock)

25. **Reddit Communities**
    - r/led
    - r/raspberry_pi
    - r/electronics
    - Search for "64x32 matrix" for ideas

26. **Adafruit Learn**
    - LED Matrix guides
    - Sample projects
    - Code examples

## 💡 Quick Implementation Tips

### Adding a New Screen to Your Project

1. Create a new class in `script.js`:
   ```javascript
   class MyCustomDisplay {
       constructor(matrix) {
           this.matrix = matrix;
       }
       
       async fetchData() {
           // Fetch your data
       }
       
       render() {
           this.matrix.clear();
           // Draw your content
           this.matrix.render();
       }
   }
   ```

2. Add to ScreenManager
3. Add button in HTML
4. Style in CSS

### Export Pixel Art to Code

If you create pixel art in Piskel/Aseprite:
1. Export as PNG (64x32)
2. Use a tool to convert to pixel array
3. Or manually sample colors and set pixels:
   ```javascript
   this.matrix.setPixel(x, y, r, g, b);
   ```

## 📚 Free APIs for More Screens

- **Weather**: wttr.in (already using!), OpenWeatherMap
- **Transit**: Transiter (using!), MTA API
- **Sports**: ESPN, TheSportsDB, MLB Stats API (using!)
- **Finance**: Alpha Vantage, CoinGecko
- **News**: NewsAPI, RSS feeds
- **Time**: WorldTimeAPI, NTP servers

## 🔧 Your Current Setup

You already have a great foundation with:
- ✅ Weather display with icons
- ✅ MLB standings
- ✅ Subway arrivals (being debugged)
- ✅ 3x5 font system
- ✅ Multi-screen switching
- ✅ 64x32 simulator

You can easily add more screens following the same pattern!

## References

[1] [RPI Zero Weather Clock](https://github.com/jkeychan/rpi-zero-weather-clock-rgb-led-matrix)
[2] [Arrivals Board](https://github.com/benarnav/arrivals-board)
[3] [Pico RGB Matrix Weather Clock](https://github.com/jake1164/pico-rgb-matrix-weather-clock)
[4] [MTA LED Sign](https://github.com/harrisonlingren/mta-led-sign)
[5] [Subway Sign Python](https://github.com/dzaharia1/subway-sign-python)
