# RGB LED Matrix Wiring Guide

## ⚡ CRITICAL POWER WARNING

**DO NOT power the RGB matrix from the Raspberry Pi's 5V pins!**

RGB LED matrices draw 2-4 Amps of current, which will:
- Damage your Raspberry Pi
- Cause brownouts and crashes
- Potentially destroy the SD card

## Required Hardware

1. **64x32 RGB LED Matrix Panel** (P2.5mm or P3mm pitch)
2. **Raspberry Pi** (any model with 40-pin GPIO header)
3. **5V Power Supply** (4A minimum, 6A recommended)
   - Must be a quality power supply
   - Barrel jack or screw terminals
4. **RGB Matrix HAT or Adapter** (recommended but optional)
   - Adafruit RGB Matrix HAT
   - Or direct wiring to GPIO

## Power Setup

### Option 1: Using Adafruit RGB Matrix HAT (Recommended)

The Adafruit RGB Matrix HAT makes wiring much easier:

1. **Install HAT on Raspberry Pi GPIO pins**
2. **Connect power:**
   - 5V power supply → HAT power input terminals
   - HAT has a passthrough to power the Pi safely
3. **Connect RGB matrix ribbon cable to HAT**

### Option 2: Direct Wiring (Advanced)

If not using a HAT, you need to wire the matrix directly to GPIO pins.

**Matrix Power:**
- Red wire (5V) → External 5V power supply **POSITIVE**
- Black wire (GND) → External 5V power supply **GROUND**
- **ALSO connect:** External power supply GROUND → Raspberry Pi GND pin

**Why connect grounds?** The Pi and matrix must share a common ground for signals to work properly.

## GPIO Pin Connections

If wiring directly without a HAT, here are the standard connections:

```
RGB Matrix Connector → Raspberry Pi GPIO
======================================

R1  (Red data 1)      → GPIO 11 (Pin 23)
G1  (Green data 1)    → GPIO 27 (Pin 13)
B1  (Blue data 1)     → GPIO  7 (Pin 26)
R2  (Red data 2)      → GPIO  8 (Pin 24)
G2  (Green data 2)    → GPIO  9 (Pin 21)
B2  (Blue data 2)     → GPIO 10 (Pin 19)

A   (Row select A)    → GPIO 22 (Pin 15)
B   (Row select B)    → GPIO 23 (Pin 16)
C   (Row select C)    → GPIO 24 (Pin 18)
D   (Row select D)    → GPIO 25 (Pin 22)

CLK (Clock)           → GPIO 17 (Pin 11)
STB (Strobe/Latch)    → GPIO  4 (Pin  7)
OE  (Output Enable)   → GPIO 18 (Pin 12)

GND                   → GND (Any ground pin)
```

**DO NOT connect the 5V wires from the matrix to the Pi!**

## Wiring Diagram

```
┌──────────────────┐          ┌──────────────────┐
│  5V Power Supply │          │   Raspberry Pi   │
│    (4-6 Amps)    │          │                  │
└──────────────────┘          └──────────────────┘
    +5V      GND                   GPIO    GND
     │        │                      │       │
     │        └──────────────────────┼───────┤
     │                               │       │
     ↓                               ↓       ↓
┌────────────────────────────────────────────────┐
│                RGB LED Matrix                  │
│                                                │
│  Power Input: 5V, GND                          │
│  Data Input: GPIO pins (see table above)       │
└────────────────────────────────────────────────┘
```

## Setup Steps

### 1. SSH into your Raspberry Pi

```bash
ssh grahamlitten@192.168.1.123
```

### 2. Run the setup script

```bash
# Download the setup script
curl -O https://raw.githubusercontent.com/GrahamLitten/rgb-led-matrix-display/main/setup_pi.sh

# Make it executable
chmod +x setup_pi.sh

# Run it
./setup_pi.sh
```

### 3. Test the matrix

```bash
cd ~/rgb-led-matrix-display
python3 matrix_display.py
```

## Troubleshooting

### Matrix doesn't light up
- Check power supply is on and providing 5V
- Verify ground connection between Pi and power supply
- Check all ribbon cable connections are secure

### Flickering or wrong colors
- Try adjusting `gpio_slowdown` in matrix_display.py (values 2-4)
- Check power supply can provide enough current
- Verify all data pins are connected correctly

### "Permission denied" errors
- Run with sudo: `sudo python3 matrix_display.py`
- Or add your user to gpio group: `sudo usermod -a -G gpio grahamlitten`

### Pi crashes or reboots
- **You're powering the matrix from the Pi!** Stop immediately
- Use external power supply for the matrix

## Configuration Options

Edit `matrix_display.py` to adjust these settings:

```python
options.brightness = 60        # 0-100 (lower = less power draw)
options.gpio_slowdown = 4      # 2-4 (higher = less flicker)
options.hardware_mapping = 'adafruit-hat'  # or 'regular'
```

## Running on Boot (Optional)

To make the display start automatically on boot:

```bash
# Create systemd service
sudo nano /etc/systemd/system/matrix-display.service
```

Paste this:

```ini
[Unit]
Description=RGB Matrix Display
After=network.target

[Service]
ExecStart=/usr/bin/python3 /home/grahamlitten/rgb-led-matrix-display/matrix_display.py
WorkingDirectory=/home/grahamlitten/rgb-led-matrix-display
StandardOutput=inherit
StandardError=inherit
Restart=always
User=root

[Install]
WantedBy=multi-user.target
```

Enable it:

```bash
sudo systemctl daemon-reload
sudo systemctl enable matrix-display.service
sudo systemctl start matrix-display.service
```

## Safety Notes

✅ **DO:**
- Use a quality 5V power supply (4A minimum)
- Connect grounds between Pi and power supply
- Test with low brightness first
- Keep the Pi cool (it will work harder driving the matrix)

❌ **DON'T:**
- Power matrix from Pi's 5V pins
- Use cheap/underpowered supplies
- Run at full brightness for extended periods without cooling
- Touch components while powered on

## Support

- Matrix library docs: https://github.com/hzeller/rpi-rgb-led-matrix
- Your project: https://github.com/GrahamLitten/rgb-led-matrix-display
- Issues: Check GitHub issues or create a new one

Good luck! 🎨✨
