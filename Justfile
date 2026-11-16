run:
  npm run dev

build:
  npm run build



# /games is deployed separately from the games repo; excluding it stops --delete-after removing it
deploy:
  rsync -uvrP --delete-after --exclude /games/ out/ root@132.145.63.131:/var/www/website/

resize:
  ./scripts/resize-images

