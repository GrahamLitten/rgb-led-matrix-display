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
            const response = await fetch('https://wttr.in/NYC?format=j1');
            const data = await response.json();
            
            this.weather = {
                temp: Math.round(data.current_condition[0].temp_F),
                condition: data.current_condition[0].weatherDesc[0].value,
                humidity: data.current_condition[0].humidity,
                feelsLike: Math.round(data.current_condition[0].FeelsLikeF)
            };
            
            this.updateInfoPanel();
            return true;
        } catch (error) {
            console.error('Error fetching weather:', error);
            this.weather = {
                temp: '--',
                condition: 'Error',
                humidity: '--',
                feelsLike: '--'
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

        // Display "NYC" at the top
        this.matrix.drawText('NYC', 20, 2, 100, 150, 255);
        
        // Display temperature in large text
        const tempStr = `${this.weather.temp}`;
        this.matrix.drawText(tempStr, 8, 12, 255, 100, 0);
        
        // Display degree symbol and F
        this.matrix.drawText('F', 38, 12, 200, 80, 0);
        
        // Display condition on bottom
        const conditionShort = this.getShortCondition(this.weather.condition);
        this.matrix.drawText(conditionShort, 2, 24, 150, 255, 150);
        
        this.matrix.render();
    }

    getShortCondition(condition) {
        const mapping = {
            'Sunny': 'SUNNY',
            'Clear': 'CLEAR',
            'Partly cloudy': 'PARTLY',
            'Cloudy': 'CLOUDY',
            'Overcast': 'OVER',
            'Mist': 'MISTY',
            'Patchy rain possible': 'RAIN',
            'Rain': 'RAIN',
            'Snow': 'SNOW',
            'Fog': 'FOGGY'
        };
        
        for (const [key, value] of Object.entries(mapping)) {
            if (condition.includes(key)) {
                return value;
            }
        }
        
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
