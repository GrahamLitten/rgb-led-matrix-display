#!/bin/bash
# RGB LED Matrix Setup Script for Raspberry Pi
# Run this on your Raspberry Pi after SSH'ing in

set -e

echo "🎨 RGB LED Matrix Display Setup"
echo "================================"
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install dependencies
echo "📦 Installing dependencies..."
sudo apt install -y python3-dev python3-pillow python3-pip git

# Install RGB Matrix library
echo "🔧 Installing RGB Matrix Python library..."
cd ~
if [ ! -d "rpi-rgb-led-matrix" ]; then
    git clone https://github.com/hzeller/rpi-rgb-led-matrix.git
fi

cd rpi-rgb-led-matrix
make build-python PYTHON=$(which python3)
sudo make install-python PYTHON=$(which python3)

# Install Python dependencies
echo "📦 Installing Python packages..."
sudo pip3 install requests Pillow --break-system-packages

# Clone your project
echo "📥 Cloning RGB LED Matrix Display project..."
cd ~
if [ ! -d "rgb-led-matrix-display" ]; then
    git clone https://github.com/GrahamLitten/rgb-led-matrix-display.git
fi

cd rgb-led-matrix-display

# Create Python script
echo "✨ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Connect your RGB matrix to the Raspberry Pi GPIO pins"
echo "2. Power the matrix with 5V power supply (NOT through Pi!)"
echo "3. Run: python3 matrix_display.py"
echo ""
echo "⚡ IMPORTANT - POWER WARNING:"
echo "• RGB matrices draw lots of power (2-4 Amps)"
echo "• DO NOT power the matrix from the Pi's 5V pins"
echo "• Use a dedicated 5V 4A+ power supply for the matrix"
echo "• Connect ground between Pi and matrix power supply"
echo ""
