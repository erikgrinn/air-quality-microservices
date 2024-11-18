import zmq
# import json

# ZeroMQ context and socket setup
context = zmq.Context()
socket = context.socket(zmq.REQ)
socket.connect("tcp://localhost:5555")

def send_request(request):
    socket.send_json(request)
    response = socket.recv_json()
    return response

patient_info = {
    "first_name": "John",
    "last_name": "Doe",
    "date_of_birth": "1990-01-01"
}

create_request = {
    "action": "create",
    "patient": patient_info,
    "prescription": {
        "written_drug": "Amoxicillin",
        "quantity": 30,
        "prescriber": "Dr. Smith"
    }
}
print("Creating prescription...")
response = send_request(create_request)
print("Response:", response)

retrieve_request = {
    "action": "retrieve",
    "patient": patient_info
}
print("\nRetrieving prescription history...")
response = send_request(retrieve_request)
print("Response:", response)

update_request = {
    "action": "update",
    "patient": patient_info,
    "prescription": {
        "written_drug": "Amoxicillin",
        "quantity": 60  # Updated quantity
    }
}
print("\nUpdating prescription...")
response = send_request(update_request)
print("Response:", response)
