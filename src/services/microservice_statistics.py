import io
import zmq
import pandas as pd

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:5555")

print("Stats Microservice started on port 5555")

def process(message):
    try:
        data = pd.read_csv(io.StringIO(message))
        if 'aqi' not in data.columns:
            return {"error": "Column 'aqi' not found in data"}
        stats = {
            "total_count": int(data.shape[0]),
            "aqi_median": round(float(data['aqi'].median()),2),
            "aqi_mean": round(float(data['aqi'].mean()),2),
            "aqi_mode": round(float(data['aqi'].mode().iloc[0]),2),
            "aqi_min": round(float(data['aqi'].min()),2),
            "aqi_max": round(float(data['aqi'].max()),2),
            "aqi_std": round(float(data['aqi'].std()),2),
            "aqi_q1": round(float(data['aqi'].quantile(0.25)), 2),
            "aqi_q3": round(float(data['aqi'].quantile(0.75)), 2)
        }
        return stats
    except Exception as e:
        return {"Error": str(e)}

while True:
    message = socket.recv_string()
    print(f"\nReceived:\n{message}")

    stats = process(message)

    print(stats)
    print("\nReturning Stats")
    socket.send_json(stats)
