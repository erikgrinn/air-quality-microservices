import zmq
# import json
import time

# Prescription database
prescription_db = {}

# ZeroMQ context and socket setup
context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:5555")


def create_prescription(data):
    patient_id = f"{data['patient']['first_name']}_{data['patient']['last_name']}_{data['patient']['date_of_birth']}"
    if patient_id not in prescription_db:
        prescription_db[patient_id] = []
    prescription_db[patient_id].append(data['prescription'])
    return {"status": "success", "message": "Prescription created"}


def retrieve_prescription_history(data):
    patient_id = f"{data['patient']['first_name']}_{data['patient']['last_name']}_{data['patient']['date_of_birth']}"
    history = prescription_db.get(patient_id, [])
    return {"status": "success", "history": history}


def update_prescription(data):
    patient_id = f"{data['patient']['first_name']}_{data['patient']['last_name']}_{data['patient']['date_of_birth']}"
    prescriptions = prescription_db.get(patient_id, [])
    for prescription in prescriptions:
        if prescription['written_drug'] == data['prescription']['written_drug']:
            prescription.update(data['prescription'])
            return {"status": "success", "message": "Prescription updated"}
    return {"status": "error", "message": "Prescription not found"}


def handle_request(request):
    time.sleep(1)
    action = request.get("action")
    if action == "create":
        return create_prescription(request)
    elif action == "retrieve":
        return retrieve_prescription_history(request)
    elif action == "update":
        return update_prescription(request)
    else:
        return {"status": "error", "message": "Invalid action"}


print("Prescription service is running...")
while True:
    # Wait for the next request
    message = socket.recv_json()
    print(f"Received request: {message}")

    # Process the request
    response = handle_request(message)

    # Send response back to client
    socket.send_json(response)