import os
import pickle
import numpy as np
import cv2
from keras_facenet import FaceNet

embedder = FaceNet()

def generate_embeddings():
    database = {}
    base_path = os.path.join("..", "data", "known_faces")
    for person_name in os.listdir(base_path):
        person_dir = os.path.join(base_path, person_name)
        if not os.path.isdir(person_dir):
            continue
        embeddings_list = []

        for img_name in os.listdir(person_dir):
            image_dir = os.path.join(person_dir, img_name)
            img = cv2.imread(image_dir)
            if img is None:
                continue   
            img_rgb = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
            detections = embedder.extract(img_rgb, threshold=0.95)

            if len(detections) > 0:
                embedding = detections[0]['embedding']
                embeddings_list.append(embedding)
            if embeddings_list:
                database[person_name] = np.mean(embeddings_list, axis=0)

        save_path = os.path.join("..", "data", "encodings.pkl")    
        with open(save_path, "wb") as f:
            pickle.dump(database, f)

if __name__ == "__main__":
    generate_embeddings()