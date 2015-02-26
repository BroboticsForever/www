#!/bin/sh
cd /root/website && NODE_ENV=production PORT=8009 grunt nodemon > /var/log/website/website.log 2>&1
