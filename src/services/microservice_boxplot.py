import zmq
import json
import matplotlib.pyplot as plt
import io
import base64
import numpy as np

context = zmq.Context()
socket = context.socket(zmq.REP)
socket.bind("tcp://*:5557")  # Bind to a new port for this microservice

print("Plot Microservice started on port 5557")

def generate_custom_plot(data):
    # Extract summary statistics
    aqi_min = float(data.get('aqi_min', 0))
    aqi_max = float(data.get('aqi_max', 0))
    aqi_median = float(data.get('aqi_median',0))
    aqi_mean = float(data.get('aqi_mean', 0))
    aqi_std = float(data.get('aqi_std', 0))
    aqi_q1 = float(data.get('aqi_q1', 0))
    aqi_q3 = float(data.get('aqi_q3', 0))
    aqi_mode = float(data.get('aqi_mode', 0))
    total_count = int(data.get('total_count', 0))

    # Create a custom plot
    fig, ax = plt.subplots()
    data_to_plot = [[aqi_median, aqi_q1, aqi_q3, aqi_q1-aqi_std, aqi_q3+aqi_std]]
    ax.boxplot(data_to_plot, vert=False)
    ax.set_title('AQI Summary Statistics')
    ax.set_xlabel('AQI Values')
    ax.set_yticklabels([])
    # ax.set_yticklabels(['Min', 'Q1', 'Mean', 'Q3', 'Max'])

    # Add additional statistics as text
    ax.text(aqi_median, 1.10, f'Median: {aqi_median:.2f}', horizontalalignment='center', verticalalignment='center')
    # ax.text(aqi_mode, 2, f'Mode: {aqi_mode:.2f}', horizontalalignment='center', verticalalignment='center')
    # ax.text(aqi_std, 3, f'Std: {aqi_std:.2f}', horizontalalignment='center', verticalalignment='center')
    # ax.text(total_count, 4, f'Count: {total_count}', horizontalalignment='center', verticalalignment='center')

    buf = io.BytesIO()
    plt.savefig(buf, format='png')
    buf.seek(0)
    img_base64 = base64.b64encode(buf.read()).decode('utf-8')
    buf.close()
    plt.close(fig)
    return img_base64

while True:
    message = socket.recv_string()
    print(f"\nReceived request: {message}")

    try:
        data = json.loads(message)
        plot_data = data.get('plot_data')
        if plot_data:
            img_base64 = generate_custom_plot(plot_data)
            print('sending plot')
            socket.send_json({"image": img_base64})
        else:
            socket.send_json({"error": "Invalid input"})
    except Exception as e:
        socket.send_json({"error": str(e)})
