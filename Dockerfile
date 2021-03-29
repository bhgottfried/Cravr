FROM ubuntu:20.04

LABEL author="Cravr"

RUN apt-get update -y && \
    apt-get install -y python3-pip python-dev

# Leverage Docker cache
COPY ./backend/requirements.txt /app/backend/requirements.txt

WORKDIR /app/backend

RUN pip3 install -r requirements.txt python-dotenv

COPY . /app

EXPOSE 5000

ENTRYPOINT [ "flask" ]

CMD [ "run" ]
