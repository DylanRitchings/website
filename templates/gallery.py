import chevron
import os
os.chdir(os.path.dirname(os.path.abspath(__file__)))

folder = "../gallery/photos/"
page_folder = "../gallery/" #TODO uppercase these
GALLERY_AMOUNT = 16

def create_image_file(image_list, img_idx, gallery_num):
    image_folder = "photos/"
    current_image = image_list[img_idx].split(".")[0]
    args = {
        "gallery": f"gallery{gallery_num}.html",
        "image_path": f"{image_folder}{current_image}.jpg",
        "small_images": []
    }

    if img_idx - 1 >= 0:
        prev_image = image_list[img_idx - 1].split(".")[0]
        args["prev_image"] = f"{prev_image}.html"
    else:
        args["prev_image"] = "#"

    if img_idx + 1 < len(image_list):
        next_image = image_list[img_idx + 1].split(".")[0]
        args["next_image"] = f"{next_image}.html"
    else:
        args["next_image"] = "#"


    for idx, image in enumerate(image_list):
        if idx < img_idx:
            alignment = "left"
        elif idx > img_idx:
            alignment = "right"
        else:
            alignment = "center"
        args["small_images"].append(
            {   
                
                "link": f"{image.split(".")[0]}.html",
                "src": f"{image_folder}{image}",
                "alignment": alignment
            }
        )
    with open("image-template.html", "r") as f:
        output = chevron.render(f, args)
    with open(f"{page_folder}{current_image}.html", "w") as f:
        f.write(output)


def create_gallery_file(image_list, gallery_num):


    args = {
        "gallery": [],
        "prev_gallery": f"gallery{gallery_num-1}.html" if gallery_num - 1 > 0 else "",
        "next_gallery": f"gallery{gallery_num+1}.html" if len(image_list) == GALLERY_AMOUNT else "", #TODO do this another way
    }
    
    for image in image_list:

        args["gallery"].append(
                {
                "link": f"{page_folder}{image.split(".")[0]}.html",
                "src": f"{folder}{image}"
            }
        )
    with open("gallery-template.html", "r") as f:
        output = chevron.render(f, args)
    with open(f"{page_folder}gallery{gallery_num}.html", "w") as f:
        f.write(output)
       

gallery_list = [] #20 per page

next_image_list = [] #5 per page

gallery_count = 0
gallery_num = 1
file_list = os.listdir(folder)
file_list_len = len(file_list) -1

if not os.path.exists('image_pages'):
    os.makedirs('image_pages')


for idx, file in enumerate(file_list):
    ext=file.split(".")[-1]
    if ext == "jpg":

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




