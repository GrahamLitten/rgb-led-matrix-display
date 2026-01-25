# Raspberry Pi RGB Matrix - Quick Start Guide

## 🎨 Get Your Matrix Running in 5 Minutes!

Your code is now ready to run on your Raspberry Pi RGB matrix. Follow these steps:

## Step 1: Power Information (READ THIS FIRST!)

### ⚡ CRITICAL: How to Power Your Matrix

Your 64x32 RGB LED matrix needs **lots of power** (2-4 Amps at 5V).

**You MUST use a separate 5V power supply for the matrix!**

### What You Need:
- **5V Power Supply** (4A minimum, 6A recommended)
- Quality supply with barrel jack or screw terminals
- Examples:
  - Mean Well 5V 5A power supply
  - Adafruit 5V 4A supply
  - Any quality 5V supply rated for 4+ Amps

### How to Connect:
1. **Matrix Power:**
   - Red wire (+5V) → Power supply positive
   - Black wire (GND) → Power supply ground

2. **Share the Ground:**
   - Connect power supply GND → Raspberry Pi GND pin (any GND pin)
   - This is critical for proper signal communication!

3. **DO NOT:**
   - ❌ Connect matrix 5V to Pi's 5V pins
   - ❌ Use the Pi to power the matrix
   - ❌ Use cheap/underpowered supplies

## Step 2: Connect to Your Pi

In your terminal (you're already connected!):

```bash
ssh grahamlitten@192.168.1.123
```
Password: `raspberry`

## Step 3: Run the Setup Script

This will install everything you need:

```bash
# Clone the project
git clone https://github.com/GrahamLitten/rgb-led-matrix-display.git
cd rgb-led-matrix-display

# Run setup
chmod +x setup_pi.sh
./setup_pi.sh
```

This will:
- ✅ Update your Pi
- ✅ Install RGB matrix library
- ✅ Install Python dependencies
- ✅ Set everything up

(This takes about 10-15 minutes)

## Step 4: Connect Your RGB Matrix

### If Using Adafruit RGB Matrix HAT (Easiest):
1. Install HAT on Pi's GPIO pins
2. Connect ribbon cable from matrix to HAT
3. Connect power supply to HAT's power terminal
4. Done!

### If Wiring Directly:
See `WIRING_GUIDE.md` for detailed pin connections.

**Quick reference:**
- Data pins go to specific GPIO pins (see wiring guide)
- Ground from matrix → Pi GND pin
- Power from matrix → External 5V supply (NOT Pi!)
- Power supply GND → Pi GND (share ground!)

## Step 5: Test It!

```bash
cd ~/rgb-led-matrix-display
sudo python3 matrix_display.py
```

You should see:
- 🌤️ Weather for NYC
- ⚾ MLB NL East standings  
- 🚇 A train times

The display rotates between screens every 30 seconds!

Press `Ctrl+C` to stop.

## Configuration

Edit `matrix_display.py` to customize:

```python
# In configure_matrix() function:
options.brightness = 60        # Lower = less power (0-100)
options.gpio_slowdown = 4      # Adjust if flickering (try 2-4)
options.hardware_mapping = 'adafruit-hat'  # or 'regular'
```

## Troubleshooting

### Nothing displays
- Check power supply is on
- Verify ground connection between Pi and supply
- Try: `sudo python3 matrix_display.py`

### Flickering/wrong colors
- Adjust `gpio_slowdown` to 2 or 3
- Check all cable connections
- Verify power supply provides enough current

### Pi keeps rebooting
- ⚠️ **You're powering the matrix from the Pi!**
- Disconnect matrix power from Pi immediately
- Use external power supply

### "Permission denied"
- Run with sudo: `sudo python3 matrix_display.py`

## Make It Run on Boot (Optional)

```bash
# Copy the service file
sudo cp systemd/matrix-display.service /etc/systemd/system/

# Enable and start
sudo systemctl daemon-reload
sudo systemctl enable matrix-display.service
sudo systemctl start matrix-display.service

# Check status
sudo systemctl status matrix-display.service
```

## What's Displayed

Your matrix will rotate through 3 screens:

### 🌤️ Screen 1: Weather
- NYC weather from wttr.in
- Temperature, condition, feels like, humidity
- Updates every 30 seconds when cycled

### ⚾ Screen 2: MLB Standings  
- NL East standings (Top 4 teams)
- Wins, Losses, Games Back
- Real-time from MLB Stats API

### 🚇 Screen 3: Subway Times
- A Train at Fulton Street (Uptown)
- Next 4 trains with arrival times
- Color-coded: Red (now), Yellow (soon), Green (later)

## Need Help?

1. Check `WIRING_GUIDE.md` for detailed wiring diagrams
2. See https://github.com/hzeller/rpi-rgb-led-matrix for library docs
3. Check your GitHub repo issues

## Hardware Specs

Your matrix:
- **Size:** 64x32 pixels (64 columns × 32 rows)
- **Voltage:** 5V DC
- **Current:** 2-4A typical (6A maximum)
- **Font:** Custom 3×5 pixel font (optimized for readability)
- **API Data:** Live from wttr.in, MLB Stats, and Transiter

Enjoy your RGB matrix display! 🎨✨
