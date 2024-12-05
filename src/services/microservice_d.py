import zmq
import pandas as pd
import io

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:5558")  # Bind to a new port for this microservice

print("Unique Defining Parameter Microservice started on port 5558")

def get_unique_defining_parameters(csv_data):
    try:
        data = pd.read_csv(io.StringIO(csv_data))
        print(data)
        unique_parameters = data['defining parameter'].iloc[0]
        return {"unique_defining_parameters": unique_parameters}
    except Exception as e:
        return {"error": str(e)}

while True:
    message = socket.recv_string()
    print(f"\nReceived request: {message}")

    try:
        result = get_unique_defining_parameters(message)
        socket.send_json(result)
    except Exception as e:
        socket.send_json({"error": str(e)})