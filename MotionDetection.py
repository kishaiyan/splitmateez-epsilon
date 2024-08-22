import cv2
import numpy as np
import boto3
import time
import logging
import os

# Configure logging
logging.basicConfig(filename='motion_detection.log', level=logging.INFO)

# AWS S3 configuration
s3 = boto3.client('s3')
bucket_name = 'motion-detection-frames-bucket'  # Replace with your actual bucket name

def compress_frame(frame, quality=85):
    encode_param = [int(cv2.IMWRITE_JPEG_QUALITY), quality]
    _, buffer = cv2.imencode('.jpg', frame, encode_param)
    return buffer

def upload_frame_to_s3(frame, frame_count, retries=3):
    buffer = compress_frame(frame)
    frame_name = f'motion_frame_{frame_count}_{int(time.time())}.jpg'
    
    for attempt in range(retries):
        try:
            s3.put_object(Bucket=bucket_name, Key=frame_name, Body=buffer.tobytes())
            logging.info(f'Successfully uploaded {frame_name} to S3')
            break
        except Exception as e:
            logging.error(f'Failed to upload {frame_name} to S3: {str(e)}')
            if attempt < retries - 1:
                time.sleep(2 ** attempt)  # Exponential backoff
            else:
                logging.error(f'Exhausted retries for {frame_name}')
                save_frame_locally(frame, frame_name)

def save_frame_locally(frame, frame_name):
    cv2.imwrite(frame_name, frame)
    logging.info(f'Saved {frame_name} locally')

def upload_local_frames():
    for filename in os.listdir('.'):
        if filename.startswith('motion_frame') and filename.endswith('.jpg'):
            with open(filename, 'rb') as file_data:
                try:
                    s3.put_object(Bucket=bucket_name, Key=filename, Body=file_data)
                    os.remove(filename)
                    logging.info(f'Successfully uploaded and removed {filename}')
                except Exception as e:
                    logging.error(f'Failed to upload {filename}: {str(e)}')

def detect_motion():
    cap = cv2.VideoCapture(0)
    ret, frame1 = cap.read()
    ret, frame2 = cap.read()
    frame_count = 0

    while cap.isOpened():
        diff = cv2.absdiff(frame1, frame2)
        gray = cv2.cvtColor(diff, cv2.COLOR_BGR2GRAY)
        blur = cv2.GaussianBlur(gray, (5, 5), 0)
        _, thresh = cv2.threshold(blur, 20, 255, cv2.THRESH_BINARY)
        dilated = cv2.dilate(thresh, None, iterations=3)
        contours, _ = cv2.findContours(dilated, cv2.RETR_TREE, cv2.CHAIN_APPROX_SIMPLE)

        for contour in contours:
            if cv2.contourArea(contour) < 1000:
                continue
            
            upload_frame_to_s3(frame1, frame_count)
            frame_count += 1

            # Draw a rectangle around the detected motion
            x, y, w, h = cv2.boundingRect(contour)
            cv2.rectangle(frame1, (x, y), (x + w, y + h), (0, 255, 0), 2)

        # Display the video feed
        cv2.imshow("Motion Detection", frame1)
        frame1 = frame2
        ret, frame2 = cap.read()

        if cv2.waitKey(10) == 27:  # Press 'Esc' to exit
            break

    cap.release()
    cv2.destroyAllWindows()

    # After detection, try to upload any local frames
    upload_local_frames()

if __name__ == '__main__':
    detect_motion()
