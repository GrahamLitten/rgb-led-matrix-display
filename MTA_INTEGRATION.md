# MTA Real-Time Subway Integration Guide

## Current Status
The web-based simulator uses **representative mock data** because:
- MTA GTFS-realtime feed uses Protocol Buffer format (binary)
- Browser-based parsing has CORS and complexity issues
- Requires backend processing for accurate real-time data

## For Live Data on Raspberry Pi

### Recommended Approach

Use a **Python backend** to parse MTA GTFS-realtime feed:

#### 1. Install Required Libraries
```bash
pip install gtfs-realtime-bindings protobuf
```

#### 2. Python Script Example
```python
from google.transit import gtfs_realtime_pb2
import requests
from datetime import datetime

# MTA A/C/E feed
feed_url = 'https://api-endpoint.mta.info/Dataservice/mtagtfsfeeds/nyct%2Fgtfs-ace'

# Add your free MTA API key (get from https://api.mta.info/)
headers = {'x-api-key': 'YOUR_MTA_API_KEY_HERE'}

response = requests.get(feed_url, headers=headers)
feed = gtfs_realtime_pb2.FeedMessage()
feed.ParseFromString(response.content)

# Fulton Street uptown A stop ID
FULTON_UPTOWN = 'A38N'  # or A31N - verify from MTA static GTFS

trains = []
now = datetime.now().timestamp()

for entity in feed.entity:
    if entity.HasField('trip_update'):
        trip = entity.trip_update
        
        # Filter for A train only
        if trip.trip.route_id == 'A':
            for update in trip.stop_time_update:
                if update.stop_id == FULTON_UPTOWN:
                    arrival_time = update.arrival.time
                    minutes_away = int((arrival_time - now) / 60)
                    
                    if 0 <= minutes_away < 30:
                        trains.append({
                            'minutes': minutes_away,
                            'route': 'A',
                            'direction': 'Uptown'
                        })

# Sort and take first 4
trains = sorted(trains, key=lambda x: x['minutes'])[:4]
print(trains)
```

## Stop ID Reference

Common Fulton Street A train stop IDs:
- `A38N` - Broadway-Nassau St/Fulton St Northbound (A,C,J,Z complex)
- `A31N` - Alternative northbound platform
- `A27N` - Another variant

**Verify correct ID:** Download MTA static GTFS data from http://web.mta.info/developers/data/nyct/subway/google_transit.zip and check `stops.txt`

## Resources

- [SubwayBuddy GitHub](https://github.com/williamwinfree/subwaybuddy) - Working RGB matrix MTA tracker
- [Arrivals Board](https://github.com/benarnav/arrivals-board) - Flask-based subway display
- [MTA Developer Resources](https://api.mta.info/) - Get API key and documentation
- [GTFS Realtime Reference](https://developers.google.com/transit/gtfs-realtime)

## Why Browser-Based is Difficult

1. **CORS restrictions** - MTA doesn't allow direct browser access
2. **Protobuf parsing** - Binary format requires special libraries
3. **Data size** - Feed is large and slow to parse in JavaScript
4. **Rate limits** - Need API key for production use

## Recommendation

For **testing/development**: Use mock data (current approach)
For **production on Raspberry Pi**: Use Python backend script that fetches real data and serves to display
