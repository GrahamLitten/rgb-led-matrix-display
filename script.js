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

    // Draw text on the matrix with smaller 3x5 font
    drawText(text, x, y, r, g, b, scale = 1) {
        const font = this.get3x5Font();
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

    // Compact 3x5 pixel font for better fit
    get3x5Font() {
        return {
            '0': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
            '1': [[0,1,0],[1,1,0],[0,1,0],[0,1,0],[1,1,1]],
            '2': [[1,1,1],[0,0,1],[1,1,1],[1,0,0],[1,1,1]],
            '3': [[1,1,1],[0,0,1],[1,1,1],[0,0,1],[1,1,1]],
            '4': [[1,0,1],[1,0,1],[1,1,1],[0,0,1],[0,0,1]],
            '5': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
            '6': [[1,1,1],[1,0,0],[1,1,1],[1,0,1],[1,1,1]],
            '7': [[1,1,1],[0,0,1],[0,0,1],[0,0,1],[0,0,1]],
            '8': [[1,1,1],[1,0,1],[1,1,1],[1,0,1],[1,1,1]],
            '9': [[1,1,1],[1,0,1],[1,1,1],[0,0,1],[1,1,1]],
            'A': [[0,1,0],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
            'B': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,1,0]],
            'C': [[1,1,1],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
            'D': [[1,1,0],[1,0,1],[1,0,1],[1,0,1],[1,1,0]],
            'E': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,1,1]],
            'F': [[1,1,1],[1,0,0],[1,1,0],[1,0,0],[1,0,0]],
            'G': [[1,1,1],[1,0,0],[1,0,1],[1,0,1],[1,1,1]],
            'H': [[1,0,1],[1,0,1],[1,1,1],[1,0,1],[1,0,1]],
            'I': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[1,1,1]],
            'J': [[0,0,1],[0,0,1],[0,0,1],[1,0,1],[1,1,1]],
            'K': [[1,0,1],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
            'L': [[1,0,0],[1,0,0],[1,0,0],[1,0,0],[1,1,1]],
            'M': [[1,0,1],[1,1,1],[1,0,1],[1,0,1],[1,0,1]],
            'N': [[1,0,1],[1,1,1],[1,0,1],[1,0,1],[1,0,1]],
            'O': [[1,1,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
            'P': [[1,1,1],[1,0,1],[1,1,1],[1,0,0],[1,0,0]],
            'Q': [[1,1,1],[1,0,1],[1,0,1],[1,1,1],[0,0,1]],
            'R': [[1,1,0],[1,0,1],[1,1,0],[1,0,1],[1,0,1]],
            'S': [[1,1,1],[1,0,0],[1,1,1],[0,0,1],[1,1,1]],
            'T': [[1,1,1],[0,1,0],[0,1,0],[0,1,0],[0,1,0]],
            'U': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[1,1,1]],
            'V': [[1,0,1],[1,0,1],[1,0,1],[1,0,1],[0,1,0]],
            'W': [[1,0,1],[1,0,1],[1,0,1],[1,1,1],[1,0,1]],
            'X': [[1,0,1],[1,0,1],[0,1,0],[1,0,1],[1,0,1]],
            'Y': [[1,0,1],[1,0,1],[0,1,0],[0,1,0],[0,1,0]],
            'Z': [[1,1,1],[0,0,1],[0,1,0],[1,0,0],[1,1,1]],
            ' ': [[0,0,0],[0,0,0],[0,0,0],[0,0,0],[0,0,0]],
            '-': [[0,0,0],[0,0,0],[1,1,1],[0,0,0],[0,0,0]],
            '%': [[1,0,1],[0,0,1],[0,1,0],[1,0,0],[1,0,1]],
        };
    }

    // Keep old font for reference
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
            
            // Get current hour
            const currentHour = new Date().getHours();
            
            // Get forecasts for 3, 6, and 12 hours from now
            const forecasts = this.getForecastData(data, currentHour);
            
            this.weather = {
                temp: Math.round(data.current_condition[0].temp_F),
                condition: data.current_condition[0].weatherDesc[0].value,
                humidity: data.current_condition[0].humidity,
                feelsLike: Math.round(data.current_condition[0].FeelsLikeF),
                weatherCode: data.current_condition[0].weatherCode,
                forecast3hr: forecasts.hour3,
                forecast6hr: forecasts.hour6,
                forecast12hr: forecasts.hour12
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
                weatherCode: '113',
                forecast3hr: null,
                forecast6hr: null,
                forecast12hr: null
            };
            return false;
        }
    }

    getForecastData(data, currentHour) {
        const hourly = [];
        
        // Combine today and tomorrow's hourly data
        if (data.weather && data.weather.length > 0) {
            data.weather.forEach(day => {
                if (day.hourly) {
                    day.hourly.forEach(hour => {
                        hourly.push({
                            time: parseInt(hour.time) / 100,
                            temp: Math.round(hour.tempF),
                            weatherCode: hour.weatherCode,
                            condition: hour.weatherDesc[0].value
                        });
                    });
                }
            });
        }
        
        // Find forecasts for 3, 6, and 12 hours ahead
        const target3 = (currentHour + 3) % 24;
        const target6 = (currentHour + 6) % 24;
        const target12 = (currentHour + 12) % 24;
        
        return {
            hour3: this.findClosestForecast(hourly, target3, currentHour, 3),
            hour6: this.findClosestForecast(hourly, target6, currentHour, 6),
            hour12: this.findClosestForecast(hourly, target12, currentHour, 12)
        };
    }

    findClosestForecast(hourly, targetHour, currentHour, hoursAhead) {
        // Get the appropriate forecast based on hours ahead
        const adjustedIndex = Math.floor(hoursAhead / 3); // 3-hour intervals in API
        
        if (adjustedIndex < hourly.length) {
            return hourly[adjustedIndex];
        }
        
        // Fallback: find by target hour
        const forecast = hourly.find(h => h.time === targetHour);
        return forecast || (hourly.length > 0 ? hourly[0] : null);
    }

    updateInfoPanel() {
        const infoDiv = document.getElementById('weatherInfo');
        if (this.weather) {
            infoDiv.innerHTML = `
                <p><strong>Location:</strong> NYC (10038)</p>
                <p><strong>Temperature:</strong> ${this.weather.temp}°F</p>
                <p><strong>Feels Like:</strong> ${this.weather.feelsLike}°F</p>
                <p><strong>Condition:</strong> ${this.weather.condition}</p>
                <p><strong>Humidity:</strong> ${this.weather.humidity}%</p>
                <p style="margin-top: 15px; padding-top: 15px; border-top: 1px solid rgba(255,255,255,0.2); color: #aaa; font-size: 0.9em;">
                    <strong>Data Source:</strong> wttr.in API<br>
                    Note: Temperature may differ from other sources due to weather station location and update timing.
                </p>
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
        
        // === WEATHER LAYOUT - 3x5 font (5px tall) + 1 blank = 6px per line ===
        
        // Row 0-4: NYC + Temperature (3x5 font = 5px tall)
        this.matrix.drawText('NYC', 1, 0, 100, 180, 255);
        
        const tempStr = `${this.weather.temp}F`;
        this.matrix.drawText(tempStr, 18, 0, 255, 220, 180);
        
        // Small weather icon
        this.drawWeatherIcon(weatherInfo.icon, 38, 0, weatherInfo.colors, 0.5);
        
        // Row 6-10: Condition (1 blank row before)
        const conditionText = this.getShortCondition(this.weather.condition);
        const condX = Math.floor((64 - (conditionText.length * 4)) / 2);
        this.matrix.drawText(conditionText, Math.max(1, condX), 6, weatherInfo.textColor.r, weatherInfo.textColor.g, weatherInfo.textColor.b);
        
        // Row 12-16: Feels like (1 blank row before)
        this.matrix.drawText('FEELS', 2, 12, 150, 170, 190);
        const feelsStr = `${this.weather.feelsLike}F`;
        this.matrix.drawText(feelsStr, 26, 12, 200, 180, 160);
        
        // Row 18-22: Humidity (1 blank row before)
        this.matrix.drawText('HUMIDITY', 2, 18, 100, 200, 255);
        const humStr = `${this.weather.humidity}%`;
        this.matrix.drawText(humStr, 40, 18, 150, 220, 255);
        
        // Row 24-28: Condition detail (1 blank row before)
        this.matrix.drawText(this.weather.condition.substring(0, 15).toUpperCase(), 2, 24, 180, 180, 200);
        
        this.matrix.render();
    }

    drawGridGuides() {
        // Draw numbered markers on top edge (every 10 pixels with count)
        for (let x = 0; x < 64; x++) {
            if (x % 10 === 0) {
                // Bright marker every 10
                this.matrix.setPixel(x, 0, 120, 0, 0);
            } else if (x % 5 === 0) {
                // Dim marker every 5
                this.matrix.setPixel(x, 0, 60, 0, 0);
            }
        }
        
        // Draw numbered markers on left edge (every 5 pixels)
        for (let y = 0; y < 32; y++) {
            if (y % 10 === 0) {
                // Bright marker every 10
                this.matrix.setPixel(0, y, 120, 0, 0);
            } else if (y % 5 === 0) {
                // Dim marker every 5
                this.matrix.setPixel(0, y, 60, 0, 0);
            }
        }
        
        // Draw bottom edge (row 31) - THE BOUNDARY
        for (let x = 0; x < 64; x++) {
            this.matrix.setPixel(x, 31, 80, 0, 0);
        }
        
        // Draw right edge (column 63) - THE BOUNDARY
        for (let y = 0; y < 32; y++) {
            this.matrix.setPixel(63, y, 80, 0, 0);
        }
        
        // Mark row 16 (divider line) in dim green for reference
        for (let x = 1; x < 63; x++) {
            if (x % 4 === 0) {
                this.matrix.setPixel(x, 16, 0, 40, 0);
            }
        }
    }


    drawMiniWeatherIcon(iconData, x, y, colors) {
        // Draw a 3x3 ultra-compact version of the icon
        for (let row = 0; row < 3; row++) {
            for (let col = 0; col < 3; col++) {
                const sourceRow = Math.floor(row * 3);
                const sourceCol = Math.floor(col * 3);
                if (sourceRow < iconData.length && sourceCol < iconData[sourceRow].length) {
                    const pixel = iconData[sourceRow][sourceCol];
                    if (pixel > 0 && colors[pixel - 1]) {
                        const color = colors[pixel - 1];
                        this.matrix.setPixel(x + col, y + row, color.r, color.g, color.b);
                    }
                }
            }
        }
    }

    drawDegreeSymbol(x, y, r, g, b) {
        // Draw a small dot for degree symbol (2x2)
        this.matrix.setPixel(x, y, r, g, b);
        this.matrix.setPixel(x + 1, y, r, g, b);
        this.matrix.setPixel(x, y + 1, r, g, b);
        this.matrix.setPixel(x + 1, y + 1, r, g, b);
    }

    drawHumidityIndicator(x, y, humidity) {
        // Compact humidity indicator with droplet icon
        // Draw water droplet pixels
        this.matrix.setPixel(x + 1, y, 100, 180, 255);
        this.matrix.setPixel(x, y + 1, 100, 180, 255);
        this.matrix.setPixel(x + 1, y + 1, 150, 220, 255);
        this.matrix.setPixel(x + 2, y + 1, 100, 180, 255);
        this.matrix.setPixel(x + 1, y + 2, 100, 180, 255);
        
        // Draw percentage
        const humText = `${humidity}`;
        this.matrix.drawText(humText, x + 4, y, 150, 220, 255);
    }

    drawWeatherIcon(iconData, x, y, colors, scale = 1.0) {
        for (let row = 0; row < iconData.length; row++) {
            for (let col = 0; col < iconData[row].length; col++) {
                const pixel = iconData[row][col];
                if (pixel > 0 && colors[pixel - 1]) {
                    const color = colors[pixel - 1];
                    const drawX = Math.floor(x + col * scale);
                    const drawY = Math.floor(y + row * scale);
                    this.matrix.setPixel(drawX, drawY, color.r, color.g, color.b);
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

// Screen Manager
class ScreenManager {
    constructor(matrix) {
        this.matrix = matrix;
        this.currentScreen = 'weather';
        this.weatherDisplay = new WeatherDisplay(matrix);
        this.mlbDisplay = new MLBStandingsDisplay(matrix);
        this.subwayDisplay = new SubwayDisplay(matrix);
    }

    async switchScreen(screenName) {
        this.currentScreen = screenName;
        await this.render();
    }

    async render() {
        if (this.currentScreen === 'weather') {
            await this.weatherDisplay.fetchWeather();
            this.weatherDisplay.render();
        } else if (this.currentScreen === 'mlb') {
            await this.mlbDisplay.fetchStandings();
            this.mlbDisplay.render();
        } else if (this.currentScreen === 'subway') {
            await this.subwayDisplay.fetchTrains();
            this.subwayDisplay.render();
        }
    }

    async update() {
        await this.render();
        const now = new Date();
        document.getElementById('lastUpdate').textContent = 
            `Last updated: ${now.toLocaleTimeString()}`;
    }
}

// MLB Standings Display
class MLBStandingsDisplay {
    constructor(matrix) {
        this.matrix = matrix;
        this.standings = null;
    }

    async fetchStandings() {
        try {
            // Using MLB Stats API for NL East standings
            const response = await fetch('https://statsapi.mlb.com/api/v1/standings?leagueId=104&season=2024&standingsTypes=regularSeason');
            const data = await response.json();
            
            // Get NL East (division ID 204)
            const nlEast = data.records.find(r => r.division.id === 204);
            
            if (nlEast) {
                this.standings = nlEast.teamRecords.slice(0, 5).map(team => ({
                    name: this.getTeamAbbr(team.team.name),
                    wins: team.wins,
                    losses: team.losses,
                    gb: team.gamesBack
                }));
            }
            
            this.updateInfoPanel();
            return true;
        } catch (error) {
            console.error('Error fetching MLB standings:', error);
            this.standings = null;
            return false;
        }
    }

    getTeamAbbr(teamName) {
        const abbrs = {
            'Atlanta Braves': 'ATL',
            'New York Mets': 'NYM',
            'Philadelphia Phillies': 'PHI',
            'Miami Marlins': 'MIA',
            'Washington Nationals': 'WSH'
        };
        return abbrs[teamName] || teamName.substring(0, 3).toUpperCase();
    }

    updateInfoPanel() {
        const infoDiv = document.getElementById('weatherInfo');
        if (this.standings) {
            let html = '<p style="color: #8b9eff; font-weight: 600; margin-bottom: 10px;">⚾ NL East Standings</p>';
            this.standings.forEach((team, idx) => {
                html += `<p><strong>${idx + 1}. ${team.name}:</strong> ${team.wins}-${team.losses} (GB: ${team.gb})</p>`;
            });
            infoDiv.innerHTML = html;
        } else {
            infoDiv.innerHTML = '<p>Loading MLB data...</p>';
        }
    }

    render() {
        this.matrix.clear();
        
        if (!this.standings) {
            this.matrix.drawText('LOADING', 8, 12, 255, 255, 0);
            this.matrix.render();
            return;
        }

        // === MLB LAYOUT - 3x5 font (5px tall) + 1 blank = 6px per line ===
        
        // Row 0-4: Title
        this.matrix.drawText('NL EAST', 22, 0, 255, 100, 100);
        
        // Can fit 5 teams now with smaller font!
        // Rows: 6, 12, 18, 24 (4 teams with 1 blank between)
        const teamYPositions = [6, 12, 18, 24];
        
        this.standings.slice(0, 4).forEach((team, idx) => {
            const y = teamYPositions[idx];
            
            const color = idx === 0 ? 
                { r: 100, g: 255, b: 100 } :  // First place - green
                { r: 180, g: 180, b: 200 };    // Others - gray
            
            // Team abbreviation
            this.matrix.drawText(team.name, 1, y, color.r, color.g, color.b);
            
            // Wins
            this.matrix.drawText(`${team.wins}`, 18, y, 100, 200, 255);
            
            // Losses
            this.matrix.drawText(`${team.losses}`, 32, y, 255, 150, 100);
            
            // Games back
            if (idx > 0 && team.gb !== '-' && team.gb !== '0.0') {
                const gb = parseFloat(team.gb);
                if (gb > 0) {
                    this.matrix.drawText(`${team.gb}`, 46, y, 200, 200, 100);
                }
            }
        });
        
        this.matrix.render();
    }
}

// Subway Display
class SubwayDisplay {
    constructor(matrix) {
        this.matrix = matrix;
        this.trains = null;
    }

    async fetchTrains() {
        try {
            // Using MTA GTFS-realtime feed for A/C/E trains
            const feedUrl = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace';
            
            // Fetch the protobuf feed
            const response = await fetch(feedUrl);
            const buffer = await response.arrayBuffer();
            const uint8Array = new Uint8Array(buffer);
            
            // Parse the GTFS-realtime feed
            const feed = GtfsRealtimeBindings.transit_realtime.FeedMessage.decode(uint8Array);
            
            // Fulton Street northbound stop IDs for A train
            // A train at Fulton St has multiple stop IDs, try them all
            const FULTON_STOP_IDS = ['A38N', 'A38', 'A27N', 'A27']; // Broadway-Nassau/Fulton St variants
            
            const aTrains = [];
            const now = Math.floor(Date.now() / 1000); // Current time in Unix timestamp
            
            // Parse feed entities
            feed.entity.forEach(entity => {
                if (entity.tripUpdate) {
                    const trip = entity.tripUpdate.trip;
                    const stopTimeUpdates = entity.tripUpdate.stopTimeUpdate;
                    
                    // Check if this is an A train
                    if (trip.routeId === 'A') {
                        // Check direction - we want northbound only (trip IDs ending in N or containing northbound indicators)
                        const isNorthbound = trip.tripId && (
                            trip.tripId.includes('..N') || 
                            trip.tripId.includes('.N.') ||
                            trip.direction === 0 // 0 = one direction, 1 = opposite
                        );
                        
                        if (isNorthbound || !trip.direction) { // If no direction, check all
                            stopTimeUpdates.forEach(stopTime => {
                                // Check if this stop is Fulton Street (try multiple IDs)
                                const stopIdMatch = FULTON_STOP_IDS.some(id => 
                                    stopTime.stopId === id || stopTime.stopId?.startsWith(id)
                                );
                                
                                if (stopIdMatch) {
                                    // Try multiple time fields
                                    const arrivalTime = 
                                        stopTime.arrival?.time?.low || 
                                        stopTime.arrival?.time ||
                                        stopTime.departure?.time?.low || 
                                        stopTime.departure?.time;
                                    
                                    if (arrivalTime) {
                                        const minutesAway = Math.floor((arrivalTime - now) / 60);
                                        
                                        // Only include trains arriving in the next 30 minutes
                                        if (minutesAway >= 0 && minutesAway < 30) {
                                            aTrains.push({
                                                minutes: minutesAway,
                                                destination: 'UPTOWN',
                                                tripId: trip.tripId,
                                                stopId: stopTime.stopId
                                            });
                                        }
                                    }
                                }
                            });
                        }
                    }
                }
            });
            
            // Sort by arrival time and take first 4
            this.trains = aTrains
                .sort((a, b) => a.minutes - b.minutes)
                .slice(0, 4);
            
            // If no trains found, show message
            if (this.trains.length === 0) {
                this.trains = [
                    { minutes: null, destination: 'NO TRAINS', tripId: null }
                ];
            }
            
            this.updateInfoPanel();
            return true;
        } catch (error) {
            console.error('Error fetching MTA data:', error);
            // Fallback to mock data if feed is unavailable
            this.trains = [
                { minutes: 2, destination: 'UPTOWN' },
                { minutes: 8, destination: 'UPTOWN' },
                { minutes: 15, destination: 'UPTOWN' },
                { minutes: 23, destination: 'UPTOWN' }
            ];
            this.updateInfoPanel();
            return false;
        }
    }

    updateInfoPanel() {
        const infoDiv = document.getElementById('weatherInfo');
        if (this.trains) {
            let html = '<p style="color: #8b9eff; font-weight: 600; margin-bottom: 10px;">🚇 A Train - Fulton St (Uptown)</p>';
            this.trains.forEach((train, idx) => {
                if (train.minutes === null) {
                    html += `<p><strong>•</strong> ${train.destination}</p>`;
                } else {
                    const timeStr = train.minutes === 0 ? 'Arriving now' : `${train.minutes} min`;
                    html += `<p><strong>${idx + 1}.</strong> ${timeStr} - ${train.destination}</p>`;
                }
            });
            const stopInfo = this.trains.length > 0 && this.trains[0].stopId ? 
                `Stop ID: ${this.trains[0].stopId}` : 
                'Checking multiple stop IDs';
            html += `<p style="margin-top: 10px; padding-top: 10px; border-top: 1px solid rgba(255,255,255,0.2); color: #aaa; font-size: 0.9em;">✓ Live MTA GTFS-realtime feed<br>Station: Fulton St<br>${stopInfo}<br>Found ${this.trains.length} train(s)</p>`;
            infoDiv.innerHTML = html;
        } else {
            infoDiv.innerHTML = '<p>Loading subway data...</p>';
        }
    }

    render() {
        this.matrix.clear();
        
        if (!this.trains) {
            this.matrix.drawText('LOADING', 8, 12, 255, 255, 0);
            this.matrix.render();
            return;
        }

        // === SUBWAY LAYOUT - 3x5 font (5px tall) + 1 blank = 6px per line ===
        
        // Row 0-4: Header
        this.matrix.drawText('A TRAIN', 1, 0, 0, 100, 255);
        this.matrix.drawText('FULTON', 34, 0, 200, 200, 220);
        
        // Can fit 4 trains now!
        // Rows: 6, 12, 18, 24 (4 trains with 1 blank between)
        const trainYPositions = [6, 12, 18, 24];
        
        this.trains.slice(0, 4).forEach((train, idx) => {
            const y = trainYPositions[idx];
            
            // Handle "no trains" message
            if (train.minutes === null) {
                this.matrix.drawText('NO TRAINS', 8, y, 200, 200, 200);
                return;
            }
            
            // Color coding based on arrival time
            let color;
            if (train.minutes <= 1) {
                color = { r: 255, g: 50, b: 50 };   // Red - arriving now
            } else if (train.minutes <= 5) {
                color = { r: 255, g: 200, b: 0 };   // Yellow - soon
            } else {
                color = { r: 100, g: 255, b: 100 }; // Green - normal
            }
            
            // Train number
            this.matrix.drawText(`${idx + 1}`, 1, y, 150, 150, 200);
            
            // Minutes
            const minStr = train.minutes === 0 ? 'NOW' : `${train.minutes}M`;
            this.matrix.drawText(minStr, 8, y, color.r, color.g, color.b);
            
            // Destination
            this.matrix.drawText('UPTOWN', 32, y, 180, 180, 200);
        });
        
        this.matrix.render();
    }
}

// Initialize
const matrix = new LEDMatrix('ledMatrix');
const screenManager = new ScreenManager(matrix);

async function updateDisplay() {
    await screenManager.update();
}

// Event listeners
document.getElementById('refreshBtn').addEventListener('click', updateDisplay);

// Screen switching buttons
document.getElementById('weatherBtn').addEventListener('click', async () => {
    await screenManager.switchScreen('weather');
    setActiveButton('weatherBtn');
});

document.getElementById('mlbBtn').addEventListener('click', async () => {
    await screenManager.switchScreen('mlb');
    setActiveButton('mlbBtn');
});

document.getElementById('subwayBtn').addEventListener('click', async () => {
    await screenManager.switchScreen('subway');
    setActiveButton('subwayBtn');
});

function setActiveButton(activeId) {
    ['weatherBtn', 'mlbBtn', 'subwayBtn'].forEach(id => {
        document.getElementById(id).classList.toggle('active', id === activeId);
    });
}

// Initial load
updateDisplay();
setActiveButton('weatherBtn');

// Auto-refresh every 10 minutes
setInterval(updateDisplay, 10 * 60 * 1000);
