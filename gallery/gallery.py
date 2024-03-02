import chevron
import os

folder = "./photos/"

def create_image_file(image_list, img_idx):
    current_image = image_list[img_idx].split(".")[0]
    
    args = {
        "image_path": f"{current_image}.jpg",
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
        args["small_images"].append(
            {   
                
                "link": f"{image.split(".")[0]}.html",
                "src": f"{image}",
                "ismain": "main_image" if image_idx==idx else ""
            }
        )

    with open("image.html", "r") as f:
        output = chevron.render(f, args)
    with open(f"{folder}{current_image}.html", "w") as f:
        f.write(output)


        

def create_gallery_file(image_list):
    args = {
        "gallery": []
    }
    
    for image in image_list:

        args["gallery"].append(
                {
                "link": f"{folder}{image.split(".")[0]}.html",
                "src": f"{folder}{image}"
            }
        )
    print(args)
    with open("gallery.html", "r") as f:
        output = chevron.render(f, args)
    with open("gallery-output.html", "w") as f:
        f.write(output)
       

gallery_list = [] #20 per page

next_image_list = [] #5 per page

gallery_count = 0

file_list = os.listdir(folder)
file_list_len = len(file_list)-1

for idx, file in enumerate(file_list):
    ext=file.split(".")[-1]
    if ext == "jpg":

        start_idx = max(0, idx - 2)  
        end_idx = min(len(file_list), idx + 3)  
        image_idx = idx - start_idx

        next_image_list = file_list[start_idx:end_idx]
        create_image_file(next_image_list, image_idx)
        next_image_list = []
        
        if gallery_count >= 20 or idx >= file_list_len:
            gallery_count = 0
            print("here")
            create_gallery_file(gallery_list)
            gallery_list = []
            
        next_image_list.append(file)
        gallery_list.append(file)




