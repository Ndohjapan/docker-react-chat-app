# docker-react-chat-app

A simple real time chat app created with Nodejs, ReactJs and MongoDB and Firebase for Authentication

The app is created to run as a docker container.

## How It Works

### Clone this repo
~~~
git clone https://github.com/Ndohjapan/docker-react-chat-app.git
~~~

### Create a firebase web app and get your credentials
![Firebase App Credentials](https://res.cloudinary.com/lcu-feeding/image/upload/v1681321735/react-chat-app/ezgif.com-video-to-gif_fb9xvo.gif)

### Create Your .env file in the 'youtube2022' directory

Add those credentials as variables into the .env file
~~~
REACT_APP_API_KEY=string
REACT_APP_AUTH_DOMAIN=string
REACT_APP_PROJECT_ID=string
REACT_APP_STORAGE_BUCKET=string
REACT_APP_MESSAGE_SENDER_ID=string
REACT_APP_APP_ID=string
REACT_APP_MEASUREMENT_ID=string
REACT_APP_API_URL=http://server:5000
~~~

### Run the docker compose in the root directory
~~~
docker-compose -f docker-compose-dev.yaml up
~~~

After that you can access the application on localhost:3000

![Login Page](https://res.cloudinary.com/lcu-feeding/image/upload/v1681319987/react-chat-app/Screenshot_2023-04-12_181819_zlwwdc.png)

![Whole Application](https://res.cloudinary.com/lcu-feeding/image/upload/v1681325579/react-chat-app/ezgif.com-video-to-gif_1_l1a0uc.gif)

## How To Test
~~~
docker compose -f docker-compose-test.yaml up
~~~

This will run a test on the server apis. you should see something like this
![Whole Application](https://res.cloudinary.com/lcu-feeding/image/upload/v1681325767/react-chat-app/Screenshot_2023-04-12_195529_jpqdxj.png)