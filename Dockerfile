FROM ubuntu:20.04 as flask
WORKDIR /app/backend
RUN apt-get update -y && apt-get install -y python3-pip python-dev
COPY ./backend/requirements.txt /app/backend/requirements.txt
RUN pip3 install -r requirements.txt python-dotenv
COPY . /app
CMD [ "flask", "run" ]

FROM node:13.12.0-alpine as react
WORKDIR /app/frontend
ENV PATH /app/node_modules/.bin:$PATH
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm install
COPY . /app
CMD [ "npm", "start" ]
