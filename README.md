# signIn-signUp-page-using-mernstack

1. Stop old container
   -------- commond: docker stop my-express

2. Remove old container
   --------- commond: docker rm my-express

3. Build New images
   --------- commmond: docker build -t my-express-app:latest .

4. Changing a image name
   -------- commond: docker build -t new-image-name:latest .

5. Run new container
   -------- commond: docker run -d --name my-express -p 5000:5000 --env-file .env my-express-app:latest

6. View logs
   -------- commond: docker logs -f my-express

7. Removing the Image ID: 
----------  commond: docker rmi IMAGE_ID


Note: if we want run this code to another pc or laptop we must delete container, image, image_id. Then we should re-build the container, image, image_id



# Running a Docker file in Frontend code

1. Build new images
--------- commond:  docker build -f Dockerfile.dev -t sign-app .

2. Run image
-------- commond: docker run --rm -it -p 3002:3000 sign-app

3. Change Container Name
--------- commond: docker run --name signin-frontend -p 3002:3000 sign-app
