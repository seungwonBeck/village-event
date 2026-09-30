from rembg import remove
from PIL import Image
import os

input_path = os.path.join(os.path.dirname(__file__), '..', '캐릭터', '훈이.jpg')
output_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'characters', 'hooni.png')

input_image = Image.open(input_path)
output_image = remove(input_image)
output_image.save(output_path, 'PNG')
print("Hooni bg removed successfully!")
