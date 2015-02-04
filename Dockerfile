#DOCKER VERSION 1.4.1 build 5bc2ff8
FROM phusion/baseimage:0.9.16
MAINTAINER Ian Tait <thetaiter@gmail.com>

#INITIAL SETUP
ENV HOME /root
RUN mkdir -p /etc/my_init.d



#CLEANUP
RUN apt-get -y clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

#EXPOSE PORTS
EXPOSE 8009

#USE PHUSION INIT SYSTEM
CMD ["/sbin/my_init"]
