import traceback
from ultralytics import YOLO
import numpy as np
import cv2
import os

classes = []
absolute_path = os.path.dirname(__file__) 
model = YOLO(os.path.join(absolute_path, "yolov8n.pt"))

with open(os.path.join(absolute_path, 'yolov8.txt'), 'r') as f:
    classes = [line.strip() for line in f.readlines()]
COLORS = np.random.uniform(0, 255, size=(len(classes), 3))


def box_label(image, box, label='', color=(128, 128, 128), txt_color=(255, 255, 255)):
  lw = max(round(sum(image.shape) / 2 * 0.003), 2)
  p1, p2 = (int(box[0]), int(box[1])), (int(box[2]), int(box[3]))
  cv2.rectangle(image, p1, p2, color, thickness=lw, lineType=cv2.LINE_AA)
  if label:
    tf = max(lw - 1, 1)  # font thickness
    w, h = cv2.getTextSize(label, 0, fontScale=lw / 3, thickness=tf)[0]  # text width, height
    outside = p1[1] - h >= 3
    p2 = p1[0] + w, p1[1] - h - 3 if outside else p1[1] + h + 3
    cv2.rectangle(image, p1, p2, color, -1, cv2.LINE_AA)  # filled
    cv2.putText(image,
                label, (p1[0], p1[1] - 2 if outside else p1[1] + h + 2),
                0,
                lw / 3,
                txt_color,
                thickness=tf,
                lineType=cv2.LINE_AA)

def plot_bboxes(image, boxes, labels=classes, colors=COLORS, score=True, conf=None):
    #plot each boxes
    for box in boxes:
        #add score in label if score=True
        if score :
            label = labels[int(box[-1])+1] + " " + str(round(100 * float(box[-2]),1)) + "%"
        else :
            label = labels[int(box[-1])+1]
        #filter every box under conf threshold if conf threshold setted
        if conf :
            if box[-2] > conf:
                color = colors[int(box[-1])]
                box_label(image, box, label, color)
            else:
                color = colors[int(box[-1])]
                box_label(image, box, label, color)


def detect_object(input_image):
       

    nparr = np.fromstring(input_image, np.uint8)
    img_np = cv2.imdecode(nparr, cv2.IMREAD_COLOR) 

    image = img_np

    results = model.predict(image)

    plot_bboxes(image, results[0].boxes.boxes, score=False, conf=0.55)

    filePath = "obj-detection.jpg"
    cv2.imwrite(filePath, image)
    cv2.destroyAllWindows() 

    try:
        with open(filePath, "rb") as fileToBeLoaded:
            f = fileToBeLoaded.read()
            y = bytearray(f)
        fileToBeLoaded.close()
        os.remove(filePath)
    except Exception:
        print(traceback.format_exc())
    return y

