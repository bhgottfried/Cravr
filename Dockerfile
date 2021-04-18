FROM ubuntu:latest as flask
WORKDIR /app/backend
RUN apt-get update -y && apt-get install -y python3-pip python-dev
COPY ./backend/requirements.txt /app/backend/requirements.txt
RUN pip3 install -r requirements.txt
COPY . /app
ENTRYPOINT [ "flask" ]
CMD [ "run" ]

FROM node:latest as react
WORKDIR /app/frontend
ENV PATH /app/node_modules/.bin:$PATH
COPY ./frontend/package.json ./
COPY ./frontend/package-lock.json ./
RUN npm install
COPY . /app
CMD [ "npm", "start" ]
