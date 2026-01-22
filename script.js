// 64x32 LED Matrix Simulator
const MATRIX_WIDTH = 64;
const MATRIX_HEIGHT = 32;
const LED_SIZE = 10; // pixels per LED

class LEDMatrix {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        this.ctx = this.canvas.getContext('2d');
        this.pixels = Array(MATRIX_HEIGHT).fill(null).map(() => 
            Array(MATRIX_WIDTH).fill(null).map(() => ({ r: 0, g: 0, b: 0 }))
        );
        this.clear();
    }

    setPixel(x, y, r, g, b) {
        if (x >= 0 && x < MATRIX_WIDTH && y >= 0 && y < MATRIX_HEIGHT) {
            this.pixels[y][x] = { r, g, b };
        }
    }

    clear() {
        for (let y = 0; y < MATRIX_HEIGHT; y++) {
            for (let x = 0; x < MATRIX_WIDTH; x++) {
                this.pixels[y][x] = { r: 0, g: 0, b: 0 };
            }
        }
    }

    render() {
        this.ctx.fillStyle = '#000';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        for (let y = 0; y < MATRIX_HEIGHT; y++) {
            for (let x = 0; x < MATRIX_WIDTH; x++) {
                const pixel = this.pixels[y][x];
                const brightness = (pixel.r + pixel.g + pixel.b) / (255 * 3);
                
                // Draw LED with glow effect
                if (brightness > 0.01) {
                    const centerX = x * LED_SIZE + LED_SIZE / 2;
                    const centerY = y * LED_SIZE + LED_SIZE / 2;
                    
                    // Glow effect
                    const gradient = this.ctx.createRadialGradient(
                        centerX, centerY, 0,
                        centerX, centerY, LED_SIZE / 2
                    );
                    gradient.addColorStop(0, `rgb(${pixel.r}, ${pixel.g}, ${pixel.b})`);
                    gradient.addColorStop(0.7, `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, 0.8)`);
                    gradient.addColorStop(1, `rgba(${pixel.r}, ${pixel.g}, ${pixel.b}, 0.1)`);
                    
                    this.ctx.fillStyle = gradient;
                    this.ctx.beginPath();
                    this.ctx.arc(centerX, centerY, LED_SIZE / 2.2, 0, Math.PI * 2);
                    this.ctx.fill();
                }
            }
        }
    }

    // Draw text on the matrix
    drawText(text, x, y, r, g, b, scale = 1) {
        const font = this.get5x7Font();
        let currentX = x;

        for (let char of text.toUpperCase()) {
            if (font[char]) {
                const charData = font[char];
                for (let row = 0; row < charData.length; row++) {
                    for (let col = 0; col < charData[row].length; col++) {
                        if (charData[row][col] === 1) {
                            for (let sy = 0; sy < scale; sy++) {
                                for (let sx = 0; sx < scale; sx++) {
                                    this.setPixel(
                                        currentX + col * scale + sx,
                                        y + row * scale + sy,
                                        r, g, b
                                    );
                                }
                            }
                        }
                    }
                }
                currentX += (charData[0].length + 1) * scale;
            }
        }
    }

    // Simple 5x7 pixel font
    get5x7Font() {
        return {
            '0': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
            '1': [[0,0,1,0,0],[0,1,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
            '2': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,1,1,1,1]],
            '3': [[0,1,1,1,0],[1,0,0,0,1],[0,0,0,0,1],[0,0,1,1,0],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
            '4': [[0,0,0,1,0],[0,0,1,1,0],[0,1,0,1,0],[1,0,0,1,0],[1,1,1,1,1],[0,0,0,1,0],[0,0,0,1,0]],
            '5': [[1,1,1,1,1],[1,0,0,0,0],[1,1,1,1,0],[0,0,0,0,1],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
            '6': [[0,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
            '7': [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[0,1,0,0,0],[0,1,0,0,0]],
            '8': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
            '9': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,1],[0,0,0,0,1],[0,0,0,0,1],[0,1,1,1,0]],
            'A': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
            'B': [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
            'C': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,1],[0,1,1,1,0]],
            'D': [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0]],
            'E': [[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
            'F': [[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
            'G': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,0],[1,0,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
            'H': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
            'I': [[0,1,1,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,1,1,1,0]],
            'J': [[0,0,1,1,1],[0,0,0,1,0],[0,0,0,1,0],[0,0,0,1,0],[0,0,0,1,0],[1,0,0,1,0],[0,1,1,0,0]],
            'K': [[1,0,0,0,1],[1,0,0,1,0],[1,0,1,0,0],[1,1,0,0,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
            'L': [[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
            'M': [[1,0,0,0,1],[1,1,0,1,1],[1,0,1,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
            'N': [[1,0,0,0,1],[1,1,0,0,1],[1,0,1,0,1],[1,0,0,1,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1]],
            'O': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
            'P': [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
            'Q': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,0,0,1,0],[0,1,1,0,1]],
            'R': [[1,1,1,1,0],[1,0,0,0,1],[1,0,0,0,1],[1,1,1,1,0],[1,0,1,0,0],[1,0,0,1,0],[1,0,0,0,1]],
            'S': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,0],[0,1,1,1,0],[0,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
            'T': [[1,1,1,1,1],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
            'U': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,1,1,0]],
            'V': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0]],
            'W': [[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,0,0,1],[1,0,1,0,1],[1,1,0,1,1],[1,0,0,0,1]],
            'X': [[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,1,0,1,0],[1,0,0,0,1],[1,0,0,0,1]],
            'Y': [[1,0,0,0,1],[1,0,0,0,1],[0,1,0,1,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0],[0,0,1,0,0]],
            'Z': [[1,1,1,1,1],[0,0,0,0,1],[0,0,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,0,0],[1,1,1,1,1]],
            ' ': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
            ':': [[0],[0],[1],[0],[1],[0],[0]],
            '°': [[1,1,0],[1,1,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
            'F': [[1,1,1,1,1],[1,0,0,0,0],[1,0,0,0,0],[1,1,1,1,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0]],
            'C': [[0,1,1,1,0],[1,0,0,0,1],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,0],[1,0,0,0,1],[0,1,1,1,0]],
            '%': [[1,1,0,0,1],[1,1,0,1,0],[0,0,1,0,0],[0,1,0,0,0],[1,0,0,1,1],[1,0,0,1,1],[0,0,0,0,0]],
        };
    }
}

// Weather Display
class WeatherDisplay {
    constructor(matrix) {
        this.matrix = matrix;
        this.weather = null;
    }

    async fetchWeather() {
        try {
            // Using wttr.in API for weather data (no API key required)
            const response = await fetch('https://wttr.in/10038?format=j1');
            const data = await response.json();
            
            this.weather = {
                temp: Math.round(data.current_condition[0].temp_F),
                condition: data.current_condition[0].weatherDesc[0].value,
                humidity: data.current_condition[0].humidity,
                feelsLike: Math.round(data.current_condition[0].FeelsLikeF),
                weatherCode: data.current_condition[0].weatherCode
            };
            
            this.updateInfoPanel();
            return true;
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.weather = {
                temp: '--',
                condition: 'Error',
                humidity: '--',
                feelsLike: '--',
                weatherCode: '113'
            };
            return false;
        }
    }

    updateInfoPanel() {
        const infoDiv = document.getElementById('weatherInfo');
        if (this.weather) {
            infoDiv.innerHTML = `
                <p><strong>Temperature:</strong> ${this.weather.temp}°F</p>
                <p><strong>Feels Like:</strong> ${this.weather.feelsLike}°F</p>
                <p><strong>Condition:</strong> ${this.weather.condition}</p>
                <p><strong>Humidity:</strong> ${this.weather.humidity}%</p>
            `;
        }
    }

    render() {
        this.matrix.clear();
        
        if (!this.weather) {
            this.matrix.drawText('LOADING', 8, 12, 255, 255, 0);
            this.matrix.render();
            return;
        }

        // Get weather icon and colors
        const weatherInfo = this.getWeatherInfo(this.weather.weatherCode, this.weather.condition);
        
        // Draw weather icon on the left (10x10 icon)
        this.drawWeatherIcon(weatherInfo.icon, 2, 3, weatherInfo.colors);
        
        // Draw temperature (large) - positioned after icon
        const tempStr = `${this.weather.temp}`;
        const tempX = 16;
        this.matrix.drawText(tempStr, tempX, 3, 255, 220, 180);
        
        // Draw degree symbol and F
        const degreeX = tempX + (tempStr.length * 6);
        this.drawDegreeSymbol(degreeX, 3, 255, 200, 150);
        this.matrix.drawText('F', degreeX + 3, 3, 255, 200, 150);
        
        // Draw "NYC" label in top right corner
        this.matrix.drawText('NYC', 46, 1, 100, 180, 255);
        
        // Draw divider line
        for (let x = 0; x < 64; x++) {
            this.matrix.setPixel(x, 15, 50, 50, 80);
        }
        
        // Draw condition text on bottom half - ensure it fits
        const conditionText = this.getShortCondition(this.weather.condition);
        const textWidth = conditionText.length * 6;
        const condX = textWidth > 62 ? 1 : Math.floor((64 - textWidth) / 2);
        this.matrix.drawText(conditionText, condX, 18, weatherInfo.textColor.r, weatherInfo.textColor.g, weatherInfo.textColor.b);
        
        // Draw humidity indicator - more compact
        this.drawHumidityBar(1, 27, this.weather.humidity);
        
        this.matrix.render();
    }

    drawDegreeSymbol(x, y, r, g, b) {
        // Draw a small circle for degree symbol
        this.matrix.setPixel(x, y, r, g, b);
        this.matrix.setPixel(x + 1, y, r, g, b);
        this.matrix.setPixel(x, y + 1, r, g, b);
        this.matrix.setPixel(x + 1, y + 1, r, g, b);
    }

    drawHumidityBar(x, y, humidity) {
        // Draw humidity label
        this.matrix.drawText('H', x, y, 100, 200, 255);
        
        // Draw humidity percentage bar - more compact
        const barWidth = Math.floor((humidity / 100) * 28);
        const barStartX = x + 7;
        
        for (let i = 0; i < 28; i++) {
            const color = i < barWidth ? 
                { r: 50, g: 150 + i * 3, b: 255 } : 
                { r: 20, g: 20, b: 40 };
            
            this.matrix.setPixel(barStartX + i, y + 1, color.r, color.g, color.b);
            this.matrix.setPixel(barStartX + i, y + 2, color.r, color.g, color.b);
        }
        
        // Draw percentage text - fits within 64 pixels
        const humidityText = `${humidity}%`;
        const textX = Math.min(barStartX + 30, 64 - (humidityText.length * 6) - 1);
        this.matrix.drawText(humidityText, textX, y, 150, 220, 255);
    }

    drawWeatherIcon(iconData, x, y, colors) {
        for (let row = 0; row < iconData.length; row++) {
            for (let col = 0; col < iconData[row].length; col++) {
                const pixel = iconData[row][col];
                if (pixel > 0 && colors[pixel - 1]) {
                    const color = colors[pixel - 1];
                    this.matrix.setPixel(x + col, y + row, color.r, color.g, color.b);
                }
            }
        }
    }

    getWeatherInfo(code, condition) {
        // Weather codes from wttr.in
        const weatherCode = parseInt(code);
        
        // Sunny/Clear
        if ([113].includes(weatherCode)) {
            return {
                icon: this.icons.sun,
                colors: [
                    { r: 255, g: 220, b: 0 },   // bright yellow sun
                    { r: 255, g: 180, b: 0 },   // orange glow
                ],
                textColor: { r: 255, g: 200, b: 100 }
            };
        }
        
        // Partly Cloudy
        if ([116].includes(weatherCode)) {
            return {
                icon: this.icons.partlyCloudy,
                colors: [
                    { r: 255, g: 220, b: 50 },  // sun
                    { r: 200, g: 200, b: 220 }, // cloud
                ],
                textColor: { r: 200, g: 220, b: 255 }
            };
        }
        
        // Cloudy/Overcast
        if ([119, 122].includes(weatherCode)) {
            return {
                icon: this.icons.cloudy,
                colors: [
                    { r: 150, g: 150, b: 170 }, // light cloud
                    { r: 100, g: 100, b: 130 }, // dark cloud
                ],
                textColor: { r: 180, g: 180, b: 200 }
            };
        }
        
        // Rainy
        if ([176, 263, 266, 281, 284, 293, 296, 299, 302, 305, 308, 311, 314, 317, 320, 323, 326, 329, 332, 335, 338, 350, 353, 356, 359, 362, 365, 368, 371, 374, 377].includes(weatherCode)) {
            return {
                icon: this.icons.rain,
                colors: [
                    { r: 100, g: 120, b: 150 }, // cloud
                    { r: 100, g: 150, b: 255 }, // rain drops
                ],
                textColor: { r: 120, g: 180, b: 255 }
            };
        }
        
        // Snowy
        if ([179, 182, 185, 227, 230, 325, 328, 331, 334, 337, 339, 342, 345, 368, 371, 374, 377, 392, 395].includes(weatherCode)) {
            return {
                icon: this.icons.snow,
                colors: [
                    { r: 120, g: 130, b: 150 }, // cloud
                    { r: 220, g: 240, b: 255 }, // snowflakes
                ],
                textColor: { r: 200, g: 230, b: 255 }
            };
        }
        
        // Thunderstorm
        if ([386, 389, 392, 395].includes(weatherCode)) {
            return {
                icon: this.icons.thunder,
                colors: [
                    { r: 80, g: 80, b: 100 },   // dark cloud
                    { r: 255, g: 255, b: 100 }, // lightning
                ],
                textColor: { r: 255, g: 255, b: 150 }
            };
        }
        
        // Fog/Mist
        if ([143, 248, 260].includes(weatherCode)) {
            return {
                icon: this.icons.fog,
                colors: [
                    { r: 150, g: 150, b: 160 }, // fog layers
                ],
                textColor: { r: 180, g: 180, b: 190 }
            };
        }
        
        // Default cloudy
        return {
            icon: this.icons.cloudy,
            colors: [
                { r: 150, g: 150, b: 170 },
                { r: 100, g: 100, b: 130 },
            ],
            textColor: { r: 180, g: 180, b: 200 }
        };
    }

    // Weather icons as pixel art (10x10)
    icons = {
        sun: [
            [0,0,0,1,0,0,1,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,1,0,0,0],
            [1,0,1,2,2,2,1,0,1,0],
            [0,0,1,2,2,2,1,0,0,0],
            [0,0,1,2,2,2,1,0,0,0],
            [1,0,1,2,2,2,1,0,1,0],
            [0,0,1,1,1,1,1,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,1,0,0,1,0,0,0],
        ],
        
        partlyCloudy: [
            [0,0,1,0,0,0,0,0,0,0],
            [0,0,0,1,1,0,0,0,0,0],
            [1,0,1,1,1,2,2,2,0,0],
            [0,0,0,0,2,2,2,2,2,0],
            [0,0,0,2,2,2,2,2,2,0],
            [0,0,0,2,2,2,2,2,2,0],
            [0,0,0,0,2,2,2,2,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ],
        
        cloudy: [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,0,0,0,0],
            [0,1,1,2,2,1,1,0,0,0],
            [1,1,2,2,2,2,1,1,1,0],
            [1,2,2,2,2,2,2,2,1,1],
            [1,2,2,2,2,2,2,2,2,1],
            [1,2,2,2,2,2,2,2,1,0],
            [0,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ],
        
        rain: [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0,0,0],
            [0,0,2,0,2,0,2,0,0,0],
            [0,0,2,0,2,0,2,0,0,0],
            [0,2,0,2,0,2,0,0,0,0],
            [0,2,0,2,0,2,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ],
        
        snow: [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,1,1,0,0,0],
            [0,2,0,2,0,2,0,2,0,0],
            [0,0,2,0,2,0,2,0,0,0],
            [0,2,0,2,0,2,0,2,0,0],
            [0,0,2,0,2,0,2,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ],
        
        thunder: [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,1,1,1,1,0,0,0,0],
            [0,1,1,1,1,1,1,0,0,0],
            [1,1,1,1,1,1,1,1,0,0],
            [0,1,1,1,1,2,2,0,0,0],
            [0,0,0,0,2,2,0,0,0,0],
            [0,0,0,2,2,0,0,0,0,0],
            [0,0,2,2,0,0,0,0,0,0],
            [0,0,2,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
        ],
        
        fog: [
            [0,0,0,0,0,0,0,0,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,0],
            [0,1,1,1,1,1,1,1,0,0],
            [0,0,0,0,0,0,0,0,0,0],
            [1,1,1,1,1,1,1,1,1,0],
            [0,0,0,0,0,0,0,0,0,0],
        ],
    };

    getShortCondition(condition) {
        const mapping = {
            'Sunny': 'SUNNY',
            'Clear': 'CLEAR',
            'Partly cloudy': 'PARTLY',
            'Cloudy': 'CLOUDY',
            'Overcast': 'OVRCAST',  // Shortened to fit
            'Mist': 'MISTY',
            'Patchy rain possible': 'LT RAIN',
            'Light rain': 'LT RAIN',
            'Rain': 'RAINY',
            'Heavy rain': 'HVY RAIN',
            'Snow': 'SNOWY',
            'Light snow': 'LT SNOW',
            'Heavy snow': 'HVY SNOW',
            'Fog': 'FOGGY',
            'Thunderstorm': 'STORM',
            'Thunder': 'STORM'
        };
        
        for (const [key, value] of Object.entries(mapping)) {
            if (condition.includes(key)) {
                return value;
            }
        }
        
        // Ensure it fits within 64 pixels (10 chars max at 6 pixels each)
        return condition.substring(0, 10).toUpperCase();
    }
}

// Initialize
const matrix = new LEDMatrix('ledMatrix');
const weatherDisplay = new WeatherDisplay(matrix);

async function updateWeather() {
    await weatherDisplay.fetchWeather();
    weatherDisplay.render();
    
    const now = new Date();
    document.getElementById('lastUpdate').textContent = 
        `Last updated: ${now.toLocaleTimeString()}`;
}

// Event listeners
document.getElementById('refreshBtn').addEventListener('click', updateWeather);

// Initial load
updateWeather();

// Auto-refresh every 10 minutes
setInterval(updateWeather, 10 * 60 * 1000);
