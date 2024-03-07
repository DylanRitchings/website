import chevron
import os
from PIL import Image 

os.chdir(os.path.dirname(os.path.abspath(__file__)))
# folder = "../gallery/photos/"
#
# image_folder = "photos/"
# thumb_folder = "thumbnails/"
# page_folder = "../gallery/" #TODO uppercase these, also rename 

GALLERY_DIR="/gallery/"
PHOTO_DIR=f"{GALLERY_DIR}photos/"
THUM_DIR=f"{PHOTO_DIR}thumbnails/"
PLCHOLD_DIR=f"{THUM_DIR}placeholder/"
ORIG_DIR=f"{PHOTO_DIR}original/"
PHOTO_PAGE_DIR = f"{GALLERY_DIR}image/"


ORIG_PATH = f"..{ORIG_DIR}"
THUM_PATH = f"..{THUM_DIR}"
PLCHOLD_PATH = f"..{PLCHOLD_DIR}"
PHOTO_PATH = f"..{PHOTO_DIR}"
PHOTO_PAGE_PATH = f"..{PHOTO_PAGE_DIR}"

GALLERY_AMOUNT = 16

def create_progressive(image):
    path = f"{PHOTO_PATH}{image}" 
    if not os.path.exists(path):
        im = Image.open(f"{ORIG_PATH}{image}")
        im.save(path, quality=100, progressive=True)

def create_thumbnails(image):
    if not os.path.exists(THUM_PATH):
        os.makedirs(THUM_PATH)
    thumb_filepath = f"{THUM_PATH}{image}"
    
    if not os.path.exists(thumb_filepath):
        im = Image.open(f"{ORIG_PATH}{image}")
        ph = im.copy()
        im.save(thumb_filepath, "JPEG", quality=20, progressive=True)
        ph.save(f"{PLCHOLD_PATH}{image}", "JPEG", quality=5, progressive=True)


def create_image_file(image_list, img_idx, gallery_num):
    current_image = image_list[img_idx].split(".")[0]
    gallery_dir = f"{GALLERY_DIR}{gallery_num}/"
    image_dir = f"{gallery_dir}{current_image}/"
    image_path = f"..{image_dir}"
    photo_page_dir = f"{PHOTO_PAGE_DIR}{current_image}/"
    photo_page_path = f"..{photo_page_dir}"

    if not os.path.exists(photo_page_path):
        os.makedirs(photo_page_path)

    args = {
        "gallery": gallery_dir,
        "image_path": f"{PHOTO_DIR}{current_image}.jpg",
        "placeholder": f"{PLCHOLD_DIR}{current_image}.jpg",
        "small_images": []
    }

    if img_idx - 1 >= 0:
        prev_image = image_list[img_idx - 1].split(".")[0]
        args["prev_image"] = f"{gallery_dir}{prev_image}/"
    else:
        args["prev_image"] = "#"

    if img_idx + 1 < len(image_list):
        next_image = image_list[img_idx + 1].split(".")[0]
        args["next_image"] = f"{gallery_dir}{next_image}/"
    else:
        args["next_image"] = "#"


    
    # image selector
    for idx, image in enumerate(image_list):
        # if idx < img_idx:
        #     alignment = "left"
        # elif idx > img_idx:
        #     alignment = "right"
        # else:
        #     alignment = "center"
        args["small_images"].append(
            {   
                
                "link": f"{PHOTO_PAGE_PATH}{image.split(".")[0]}",
                "src": f"{THUM_DIR}{image}",
                "alignment": ""
            }
        )
    with open("image-template.html", "r") as f:
        output = chevron.render(f, args)
    with open(f"{photo_page_path}index.html", "w") as f:
        f.write(output)


def create_gallery_file(image_list, gallery_num):
    gallery_dir = f"{GALLERY_DIR}{gallery_num}/"
    gallery_path = f"..{gallery_dir}"

    if not os.path.exists(gallery_path):
        os.makedirs(gallery_path)

    args = {
        "gallery": [],
        "prev_gallery": f"{GALLERY_DIR}{gallery_num-1}/" if gallery_num - 1 > 0 else "",
        "this_gallery": gallery_dir,
        "next_gallery": f"{GALLERY_DIR}{gallery_num+1}/" if len(image_list) == GALLERY_AMOUNT else "", #TODO do this another way
    }
    
    for image in image_list:

        args["gallery"].append(
                {
                "link": f"{PHOTO_PAGE_DIR}{image.split(".")[0]}/",
                "src": f"{THUM_DIR}{image}",
                "placeholder": f"{PLCHOLD_DIR}{image}"
            }
        )
    with open("gallery-template.html", "r") as f:
        output = chevron.render(f, args)
    with open(f"{gallery_path}index.html", "w") as f:
        f.write(output)
       

gallery_list = [] #20 per page

next_image_list = [] #5 per page

gallery_count = 0
gallery_num = 1
file_list = os.listdir(ORIG_PATH)
print(file_list)
file_list_len = len(file_list) -1


for idx, file in enumerate(file_list):
    ext=file.split(".")[-1]
    if ext == "jpg":
        create_thumbnails(file)
        create_progressive(file)
        next_image_list.append(file)
        gallery_list.append(file)

        start_idx = max(0, idx - 2)  
        end_idx = min(len(file_list), idx + 3)  
        image_idx = idx - start_idx

        next_image_list = file_list[start_idx:end_idx]
        create_image_file(next_image_list, image_idx, gallery_num)
        next_image_list = []

        if gallery_count == GALLERY_AMOUNT-1 or idx == file_list_len:
            gallery_count = 0
            create_gallery_file(gallery_list, gallery_num)
            gallery_list = []
            gallery_num+=1


        gallery_count+=1




