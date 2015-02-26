#DOCKER VERSION 1.4.1 build 5bc2ff8
FROM phusion/baseimage:0.9.16
MAINTAINER Ian Tait <thetaiter@gmail.com>

#INITIAL SETUP
ENV HOME /root
RUN mkdir -p /etc/my_init.d

# INSTALL NODEJS
RUN curl -sL https://deb.nodesource.com/setup | bash -
RUN DEBIAN_FRONTEND=noninteractive apt-get -y install nodejs

# INSTALL GIT
RUN \
  DEBIAN_FRONTEND=noninteractive apt-get -y install git && \
  git config --global user.name "Ian Tait" && \
  git config --global user.email "thetaiter@gmail.com"

# INSTALL WWW
COPY ./website /root/website
COPY ./scripts/start_www.sh /etc/my_init.d/startup.sh
RUN \
  cd /root/website && \
  npm install -g bower && \
  npm install -g grunt-cli && \
  npm install && \
  bower install --allow-root

#CLEANUP
RUN apt-get -y clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

#EXPOSE PORTS
EXPOSE 8009

#USE PHUSION INIT SYSTEM
CMD ["/sbin/my_init"]
