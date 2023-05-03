import cv2
import numpy as np
import os

classes = []
absolute_path = os.path.dirname(__file__) 
with open(os.path.join(absolute_path, 'yolov3.txt'), 'r') as f:
    classes = [line.strip() for line in f.readlines()]
COLORS = np.random.uniform(0, 255, size=(len(classes), 3))


def get_output_layers(net):
    layer_names = net.getLayerNames()
    try:
        output_layers = [layer_names[i - 1] for i in net.getUnconnectedOutLayers()]
    except:
        output_layers = [layer_names[i[0] - 1] for i in net.getUnconnectedOutLayers()]

    return output_layers


def draw_prediction(img, class_id, confidence, x, y, x_plus_w, y_plus_h):
    if confidence < 0.5:
        return;
    label = str(classes[class_id])
    
    font = cv2.FONT_HERSHEY_SIMPLEX
    font_scale = 1
    thickness = 2

    # Draw a rectangle that covers the detected object
    cv2.rectangle(img, (x, y), (x_plus_w, y_plus_h), COLORS[class_id], thickness)
    # Get the size of the label text
    text_size, _ = cv2.getTextSize(label, font, font_scale, thickness)
    text_width, text_height = text_size[0], text_size[1]

    # Set the size of the background rectangle
    rect_width = int(text_width * 1.5)
    rect_height = int(text_height * 1.5)

    # Calculate the coordinates of the background rectangle
    rect_x = x
    rect_y = y - rect_height - 5

    # Draw the background rectangle
    cv2.rectangle(img, (rect_x, rect_y), (rect_x + rect_width, rect_y + rect_height), (0,0,0), cv2.FILLED)
    # Draw the label text on top of the background rectangle
    cv2.putText(img, label, (x, y - int(text_height * 0.5) - 5), font, font_scale, (255,255,255), thickness)




def detect_object(img_np_array):
    '''
    parameter img_np_array expects a numpy array
    with RGBA channels
    '''
    # Convert the color channels from RGBA to BGR
    bgr_image = cv2.cvtColor(img_np_array, cv2.COLOR_RGBA2BGR)
    image = bgr_image
    
    # Load the pre-trained YOLO model
    net = cv2.dnn.readNet(os.path.join(absolute_path, 'yolov3.weights'), os.path.join(absolute_path, 'yolov3.cfg'))
    
    # Create a blob from the image
    blob = cv2.dnn.blobFromImage(image, 1 / 255.0, (416, 416), swapRB=True, crop=False)

    # Pass the blob through the network and get the outputs
    net.setInput(blob)
    outs = net.forward(get_output_layers(net))

    # Set the confidence threshold and non-maximum suppression threshold
    conf_threshold = 0.5
    nms_threshold = 0.4
    
    # Get the dimensions of the image
    (Height, Width) = image.shape[:2]
    
    # List to store detected objects and their bounding boxes
    class_ids = []
    confidences = []
    boxes = []

# Parse the outputs to get the detected objects and their bounding boxes
    for output in outs:
        for detection in output:
            scores = detection[5:]
            class_id = np.argmax(scores)
            confidence = scores[class_id]

            if confidence > conf_threshold:
                # Scale the bounding box coordinates back relative to the size of the image
                box = detection[0:4] * np.array([Width, Height, Width, Height])
                (center_x, center_y, w, h) = box.astype("int")

                # Use the center (x, y)-coordinates to derive the top and
                # and left corner of the bounding box
                x = int(center_x - (w / 2))
                y = int(center_y - (h / 2))

                # Update the list
                boxes.append([x, y, int(w), int(h)])
                confidences.append(float(confidence))
                class_ids.append(class_id)

    # Apply non-maximum suppression to remove overlapping bounding boxes
    indices = cv2.dnn.NMSBoxes(boxes, confidences, conf_threshold, nms_threshold)
    
    # Draw the final bounding boxes on the image
    for i in indices:
        try:
            box = boxes[i]
        except:
            i = i[0]
            box = boxes[i]
        
        x = box[0]
        y = box[1]
        w = box[2]
        h = box[3]
        draw_prediction(image, class_ids[i], confidences[i], round(x), round(y), round(x+w), round(y+h))

    # Convert BGR image to RGBA format
    rgba_image = cv2.cvtColor(image, cv2.COLOR_BGR2RGBA)

    # Return detected image as an RGBA numpy array
    return rgba_image