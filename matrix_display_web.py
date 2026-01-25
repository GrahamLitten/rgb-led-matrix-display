#!/usr/bin/env python3
"""
Web-Controlled RGB LED Matrix Display for Raspberry Pi
API endpoint to change screens remotely
"""

import time
import requests
from rgbmatrix import RGBMatrix, RGBMatrixOptions
import json
from flask import Flask, jsonify, request
from flask_cors import CORS
import threading

# Matrix Configuration
def configure_matrix():
    options = RGBMatrixOptions()
    options.led_rgb_sequence = "RBG"  # Swap green and blue channels
    options.rows = 32
    options.cols = 64
    options.chain_length = 1
    options.parallel = 1
    options.hardware_mapping = 'regular'
    options.gpio_slowdown = 4
    options.brightness = 60
    options.pwm_lsb_nanoseconds = 130
    options.disable_hardware_pulsing = True
    
    return RGBMatrix(options = options)

# Custom 3x5 Font Data
FONT_3X5 = {
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
}

class MatrixDisplay:
    def __init__(self, matrix):
        self.matrix = matrix
        self.canvas = matrix.CreateFrameCanvas()
        
    def clear(self):
        self.canvas.Clear()
        
    def set_pixel(self, x, y, r, g, b):
        if 0 <= x < 64 and 0 <= y < 32:
            self.canvas.SetPixel(x, y, r, g, b)
            
    def draw_text(self, text, x, y, r, g, b):
        """Draw text using 3x5 pixel font"""
        current_x = x
        for char in text.upper():
            if char in FONT_3X5:
                char_data = FONT_3X5[char]
                for row in range(len(char_data)):
                    for col in range(len(char_data[row])):
                        if char_data[row][col] == 1:
                            self.set_pixel(current_x + col, y + row, r, g, b)
                current_x += len(char_data[0]) + 1
                
    def show(self):
        self.canvas = self.matrix.SwapOnVSync(self.canvas)


class WeatherDisplay:
    def __init__(self, display):
        self.display = display
        self.weather = None
        
    def fetch_weather(self):
        try:
            response = requests.get('https://wttr.in/10038?format=j1', timeout=10)
            data = response.json()
            
            self.weather = {
                'temp': round(float(data['current_condition'][0]['temp_F'])),
                'condition': data['current_condition'][0]['weatherDesc'][0]['value'],
                'humidity': data['current_condition'][0]['humidity'],
                'feelsLike': round(float(data['current_condition'][0]['FeelsLikeF'])),
            }
            print(f"✅ Weather: {self.weather['temp']}°F - {self.weather['condition']}")
            return True
        except Exception as e:
            print(f"❌ Weather fetch error: {e}")
            self.weather = {'temp': '--', 'condition': 'Error', 'humidity': '--', 'feelsLike': '--'}
            return False
            
    def render(self):
        self.display.clear()
        
        if not self.weather:
            self.display.draw_text('LOADING', 8, 12, 255, 255, 0)
            self.display.show()
            return
            
        # Row 0-4: NYC + Temperature
        self.display.draw_text('NYC', 1, 0, 100, 180, 255)
        temp_str = f"{self.weather['temp']}F"
        self.display.draw_text(temp_str, 18, 0, 255, 220, 180)
        
        # Row 6-10: Condition
        condition = self.get_short_condition(self.weather['condition'])
        self.display.draw_text(condition, 2, 6, 200, 200, 255)
        
        # Row 12-16: Feels like
        self.display.draw_text('FEELS', 2, 12, 150, 170, 190)
        feels_str = f"{self.weather['feelsLike']}F"
        self.display.draw_text(feels_str, 26, 12, 200, 180, 160)
        
        # Row 18-22: Humidity
        self.display.draw_text('HUMIDITY', 2, 18, 100, 200, 255)
        hum_str = f"{self.weather['humidity']}%"
        self.display.draw_text(hum_str, 40, 18, 150, 220, 255)
        
        self.display.show()
        
    def get_short_condition(self, condition):
        mapping = {
            'Sunny': 'SUNNY',
            'Clear': 'CLEAR',
            'Partly cloudy': 'PARTLY',
            'Cloudy': 'CLOUDY',
            'Overcast': 'OVRCAST',
            'Mist': 'MISTY',
            'Light rain': 'LT RAIN',
            'Rain': 'RAINY',
            'Heavy rain': 'HVY RAIN',
            'Snow': 'SNOWY',
            'Fog': 'FOGGY'
        }
        
        for key, value in mapping.items():
            if key in condition:
                return value
        return condition[:10].upper()


class MLBDisplay:
    def __init__(self, display):
        self.display = display
        self.standings = None
        
    def fetch_standings(self):
        try:
            response = requests.get(
                'https://statsapi.mlb.com/api/v1/standings?leagueId=104&season=2024&standingsTypes=regularSeason',
                timeout=10
            )
            data = response.json()
            
            nl_east = next((r for r in data['records'] if r['division']['id'] == 204), None)
            
            if nl_east:
                self.standings = []
                for team in nl_east['teamRecords'][:4]:
                    self.standings.append({
                        'name': self.get_team_abbr(team['team']['name']),
                        'wins': team['wins'],
                        'losses': team['losses'],
                        'gb': team['gamesBack']
                    })
                print(f"✅ MLB: {len(self.standings)} teams loaded")
                return True
        except Exception as e:
            print(f"❌ MLB fetch error: {e}")
            self.standings = None
            return False
            
    def get_team_abbr(self, team_name):
        abbrs = {
            'Atlanta Braves': 'ATL',
            'New York Mets': 'NYM',
            'Philadelphia Phillies': 'PHI',
            'Miami Marlins': 'MIA',
            'Washington Nationals': 'WSH'
        }
        return abbrs.get(team_name, team_name[:3].upper())
        
    def render(self):
        self.display.clear()
        
        if not self.standings:
            self.display.draw_text('LOADING', 8, 12, 255, 255, 0)
            self.display.show()
            return
            
        # Row 0-4: Title
        self.display.draw_text('NL EAST', 22, 0, 255, 100, 100)
        
        y_positions = [6, 12, 18, 24]
        
        for idx, team in enumerate(self.standings[:4]):
            y = y_positions[idx]
            
            if idx == 0:
                color = (100, 255, 100)
            else:
                color = (180, 180, 200)
                
            self.display.draw_text(team['name'], 1, y, *color)
            self.display.draw_text(str(team['wins']), 18, y, 100, 200, 255)
            self.display.draw_text(str(team['losses']), 32, y, 255, 150, 100)
            
            if idx > 0 and team['gb'] not in ['-', '0.0']:
                gb = float(team['gb'])
                if gb > 0:
                    self.display.draw_text(str(team['gb']), 46, y, 200, 200, 100)
                    
        self.display.show()


class SubwayDisplay:
    def __init__(self, display):
        self.display = display
        self.trains = None
        
    def fetch_trains(self):
        try:
            url = 'https://demo.transiter.dev/systems/us-ny-subway/stops/A38'
            proxied_url = f'https://api.allorigins.win/get?url={requests.utils.quote(url)}'
            
            response = requests.get(proxied_url, timeout=10)
            proxy_data = response.json()
            data = json.loads(proxy_data['contents'])
            
            all_trains = []
            
            if 'stopTimes' in data:
                for st in data['stopTimes']:
                    route = st.get('trip', {}).get('route', {}).get('id')
                    headsign = st.get('headsign', '')
                    
                    if route == 'A' and 'Uptown' in headsign and 'departure' in st:
                        departure_time = st['departure']['time']
                        now = time.time()
                        minutes_away = int((departure_time - now) / 60)
                        
                        if 0 <= minutes_away < 30:
                            all_trains.append({
                                'minutes': minutes_away,
                                'destination': 'UPTOWN'
                            })
                            
            self.trains = sorted(all_trains, key=lambda x: x['minutes'])[:4]
            
            if not self.trains:
                self.trains = [{'minutes': None, 'destination': 'NO TRAINS'}]
                
            print(f"✅ Subway: {len([t for t in self.trains if t['minutes'] is not None])} trains")
            return True
        except Exception as e:
            print(f"❌ Subway fetch error: {e}")
            self.trains = [{'minutes': None, 'destination': 'ERROR'}]
            return False
            
    def render(self):
        self.display.clear()
        
        if not self.trains:
            self.display.draw_text('LOADING', 8, 12, 255, 255, 0)
            self.display.show()
            return
            
        self.display.draw_text('A TRAIN', 1, 0, 0, 100, 255)
        self.display.draw_text('FULTON', 34, 0, 200, 200, 220)
        
        y_positions = [6, 12, 18, 24]
        
        for idx, train in enumerate(self.trains[:4]):
            y = y_positions[idx]
            
            if train['minutes'] is None:
                self.display.draw_text('NO TRAINS', 8, y, 200, 200, 200)
                continue
                
            if train['minutes'] <= 1:
                color = (255, 50, 50)
            elif train['minutes'] <= 5:
                color = (255, 200, 0)
            else:
                color = (100, 255, 100)
                
            self.display.draw_text(str(idx + 1), 1, y, 150, 150, 200)
            
            min_str = 'NOW' if train['minutes'] == 0 else f"{train['minutes']}M"
            self.display.draw_text(min_str, 8, y, *color)
            
            self.display.draw_text('UPTOWN', 32, y, 180, 180, 200)
            
        self.display.show()


# Global state
current_screen = 'weather'
auto_rotate = True
matrix = None
display = None
weather_display = None
mlb_display = None
subway_display = None

# Flask app
app = Flask(__name__)
CORS(app)

@app.route('/api/screen', methods=['GET'])
def get_screen():
    return jsonify({
        'current': current_screen,
        'auto_rotate': auto_rotate
    })

@app.route('/api/screen', methods=['POST'])
def set_screen():
    global current_screen, auto_rotate
    
    data = request.json
    
    if 'screen' in data:
        screen = data['screen']
        if screen in ['weather', 'mlb', 'subway']:
            current_screen = screen
            print(f"📺 Screen changed to: {current_screen}")
            
    if 'auto_rotate' in data:
        auto_rotate = data['auto_rotate']
        print(f"🔄 Auto-rotate: {auto_rotate}")
        
    return jsonify({'success': True, 'current': current_screen, 'auto_rotate': auto_rotate})

@app.route('/api/status', methods=['GET'])
def get_status():
    return jsonify({
        'screen': current_screen,
        'auto_rotate': auto_rotate,
        'available_screens': ['weather', 'mlb', 'subway']
    })


def display_loop():
    """Background thread that updates the display"""
    global current_screen, auto_rotate
    
    last_update = 0
    last_rotation = time.time()
    
    screens = ['weather', 'mlb', 'subway']
    
    while True:
        now = time.time()
        
        # Auto-rotate every 30 seconds
        if auto_rotate and (now - last_rotation) >= 30:
            current_idx = screens.index(current_screen)
            current_screen = screens[(current_idx + 1) % len(screens)]
            last_rotation = now
            print(f"📺 Auto-rotating to: {current_screen}")
        
        # Refresh data every 60 seconds
        if (now - last_update) >= 60:
            print(f"🔄 Refreshing data...")
            weather_display.fetch_weather()
            mlb_display.fetch_standings()
            subway_display.fetch_trains()
            last_update = now
        
        # Render current screen
        if current_screen == 'weather':
            weather_display.render()
        elif current_screen == 'mlb':
            mlb_display.render()
        elif current_screen == 'subway':
            subway_display.render()
            
        time.sleep(1)


def main():
    global matrix, display, weather_display, mlb_display, subway_display
    
    print("🎨 Web-Controlled RGB LED Matrix Display Starting...")
    print("🌐 API will be available at http://192.168.1.123:5000")
    
    # Initialize matrix
    matrix = configure_matrix()
    display = MatrixDisplay(matrix)
    
    # Create displays
    weather_display = WeatherDisplay(display)
    mlb_display = MLBDisplay(display)
    subway_display = SubwayDisplay(display)
    
    # Initial data fetch
    weather_display.fetch_weather()
    mlb_display.fetch_standings()
    subway_display.fetch_trains()
    
    # Start display loop in background thread
    display_thread = threading.Thread(target=display_loop, daemon=True)
    display_thread.start()
    
    # Run Flask app
    app.run(host='0.0.0.0', port=5000, debug=False)


if __name__ == '__main__':
    main()
