import cv2
import time
import json
import base64  # Add base64 import for encoding
import logging
from AWSIoTPythonSDK.MQTTLib import AWSIoTMQTTClient

# Configure logging
logging.basicConfig(filename='motion_detection.log', level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')

# AWS IoT Core settings (replace these with your actual values)
client_id = "YourClientID"
endpoint = "your-endpoint.iot.region.amazonaws.com"
root_ca = "/path/to/AmazonRootCA1.pem"
private_key = "/path/to/private.pem.key"
certificate = "/path/to/certificate.pem.crt"

# Initialize MQTT client for AWS IoT Core
mqtt_client = AWSIoTMQTTClient(client_id)
mqtt_client.configureEndpoint(endpoint, 8883)
mqtt_client.configureCredentials(root_ca, private_key, certificate)

# Connect to AWS IoT Core
try:
    mqtt_client.connect()
    logging.info("Connected to AWS IoT Core")
except Exception as e:
    logging.error(f"Failed to connect to AWS IoT Core: {e}")
    exit(1)

def publish_frame_to_iot(frame, frame_count):
    try:
        # Encode the frame as JPEG
        ret, buffer = cv2.imencode('.jpg', frame)
        
        if ret:
            # Convert the buffer to base64
            image_data = base64.b64encode(buffer).decode('utf-8')
            
            # Create the payload
            payload = {
                "frame_count": frame_count,
                "timestamp": int(time.time()),
                "image_data": image_data
            }

            # Publish the payload to the AWS IoT Core topic
            mqtt_client.publish("motion/frames", json.dumps(payload), 1)
            logging.info(f"Frame {frame_count} published to AWS IoT Core")
        else:
            logging.error(f"Failed to encode frame {frame_count}")
    except Exception as e:
        logging.error(f"Error in publishing frame {frame_count} to AWS IoT Core: {e}")

def detect_motion():
    cap = cv2.VideoCapture(0)
    ret, frame1 = cap.read()
    ret, frame2 = cap.read()
    frame_count = 0

    while cap.isOpened():
        try:
            diff = cv2.absdiff(frame1, frame2)
            gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
            blur = cv2.GaussianBlur(gray, (5, 5), 0)
            _, thresh = cv2.threshold(blur, 20, 255, cv2.THRESH_BINARY)
            dilated = cv2.dilate(thresh, None, iterations=3)
            contours, _ = cv2.findContours(dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

            for contour in contours:
                if cv2.contourArea(contour) < 1000:
                    continue

                # Increment frame count for each detected motion
                frame_count += 1

                # Publish the frame to AWS IoT Core
                publish_frame_to_iot(frame1, frame_count)

                # Draw a rectangle around the detected motion
                x, y, w, h = cv2.boundingRect(contour)
                cv2.rectangle(frame1, (x, y), (x + w, y + h), (0, 255, 0), 2)

            # Display the video feed with detected motion
            cv2.imshow("Motion Detection", frame1)
            frame1 = frame2
            ret, frame2 = cap.read()

            if cv2.waitKey(10) == 27:  # Press 'Esc' to exit
                break

        except Exception as e:
            logging.error(f"Error during motion detection: {e}")

    cap.release()
    cv2.destroyAllWindows()

if __name__ == '__main__':
    try:
        detect_motion()
    finally:
        mqtt_client.disconnect()
        logging.info("Disconnected from AWS IoT Core")
