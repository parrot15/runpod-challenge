### Considerations
Your requirements stated that I must store images locally, so I 
have done so.

However, obviously in the real-world, I would store the images into
a production-grade mass file storage service like AWS S3, rather
than storing the images locally. Then, when the client requests 
images from the server, the server merely sends the client the CDN 
URLs of the images (e.g. `https://cdn.example.com/images/image1.jpg`). 
The client will then fetch the images from these URLs and display 
them. This is the most scalable solution.

Prompts, job IDs, and the resulting images need to be associated 
together, so I store them all together as a 'run', and these runs 
are stored in a NoSQL (MongoDB) database. I chose to use a NoSQL 
database because it is far better at horizontal scaling. Considering 
this is an image service where each user could have 100s of images, 
and the fact that the data model has few relations, a NoSQL database 
is a good fit for storing the image metadata.