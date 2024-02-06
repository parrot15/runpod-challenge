# Runpod Take-home Challenge
Eashan Soni

## Running the application
Ensure that `docker` and `docker-compose` are installed in your system.
Then, navigate to the root directory of the project and run:
```bash
docker-compose up -d
```
This command builds and starts the containers in detached mode. The 
client will be accessible at `http://localhost:3000`, and the server 
at `http://localhost:8000`.

To view the real-time logs of the application, run:
```bash
docker-compose logs -f
```

To stop the application, run:
```bash
docker-compose down
```

## Formatting the code
To format all the code for the client and server, run the following 
commands in the respective `client/` and `server/` directories:
```bash
npm run format
```

## High-level overview
The application consists of a client and a server, both containerized 
using Docker. The client is a Next.js app that communicates with the 
server via REST API. The server, built with Express.js, handles image 
generation requests, stores metadata in MongoDB, and statically serves 
the generated images.

Prompts, job IDs, and the resulting images need to be associated 
together, so I store them all together as a 'run', and these runs 
are stored in a NoSQL (MongoDB) database. I chose to use a NoSQL 
database because it is far better at horizontal scaling. Considering 
this is an image service where each user could have 100s of images, 
and the fact that the data model has few relations, a NoSQL database 
is a good fit for storing the image metadata.

The server stores images locally in a Docker volume, as per the 
requirements. When the client requests for images, the server sends 
all the image metadata, and the client uses that to fetch the images, 
which the server serves statically.

For ongoing generations, the client continuously polls for updates 
from the server and displays the states to the user in real-time.
It does this concurrently for each generation.

## Real-world considerations
Obviously in the real-world, I would store the images in a 
production-grade mass file storage service like AWS S3, rather than 
storing the images locally. Then, when the client requests images 
from the server, the server merely sends the client the CDN URLs of 
the images (e.g. `https://cdn.example.com/images/image1.jpg`). The 
client will then fetch the images from these URLs and display them. 
This is the most scalable solution.

Also, I'd use webhooks rather than polling to track the status of 
the image generations. This would be much more efficient, since the 
Runpod API could just push to the server whenever there is an update.
Unfortunately, webhooks require a publicly accessible URL, and since 
my project is running locally, I couldn't use webhooks.

Finally, I would add unit tests for both the frontend components and 
backend API endpoints.