import zmq
import requests
import json

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:5556")  # Bind to a new port for this microservice

print("IQAir Microservice started on port 5556")

API_KEY = ''  # Replace with your IQAir API key
BASE_URL = 'http://api.airvisual.com/v2/city'

def fetch_iqair_data(city, state, country='USA'):
    url = f"{BASE_URL}?city={city}&state={state}&country={country}&key={API_KEY}"
    response = requests.get(url)
    if response.status_code == 200:
        return response.json()
    else:
        return {"error": "Failed to fetch data"}

while True:
    message = socket.recv_string()
    print(f"\nReceived request: {message}")

    try:
        data = json.loads(message)
        city = data.get('city')
        state = data.get('state')
        country = data.get('country', 'USA')
        if city and state:
            iqair_data = fetch_iqair_data(city, state, country)
            socket.send_json(iqair_data)
        else:
            socket.send_json({"error": "Invalid input"})
    except Exception as e:
        socket.send_json({"error": str(e)})