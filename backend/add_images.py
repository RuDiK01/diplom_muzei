import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'museum.settings')
django.setup()

from api.models import Exhibit
from django.core.files import File

def add_images_to_exhibits():
    exhibits = Exhibit.objects.all()
    for i, exhibit in enumerate(exhibits, 1):
        image_path = f'media/exhibits/{i}.jpg'
        if os.path.exists(image_path):
            with open(image_path, 'rb') as f:
                exhibit.image.save(f'{i}.jpg', File(f), save=True)
                print(f'Added image {i}.jpg to exhibit {exhibit.name}')

if __name__ == '__main__':
    add_images_to_exhibits() 