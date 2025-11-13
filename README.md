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
