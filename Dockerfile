FROM ubuntu:17.10

RUN apt-get update
RUN apt-get -y install apache2
RUN apt-get -y install python3.5
RUN apt-get -y install python3-pip
RUN apt-get -y install python3-setuptools
RUN apt-get -y install curl
RUN curl -sL https://deb.nodesource.com/setup_8.x | bash -
RUN apt-get -y install nodejs

ENV DEBIAN_FRONTEND "noninteractive"
RUN apt-get -y install mysql-server

RUN ln -s /usr/bin/python3 /usr/local/bin/python3

ENV APACHE_RUN_USER www-data
ENV APACHE_RUN_GROUP www-data
ENV APACHE_LOG_DIR /var/log/apache2
ENV APACHE_PID_FILE /var/run/apache2.pid
ENV APACHE_RUN_DIR /var/run/apache2
ENV APACHE_LOCK_DIR /var/lock/apache2
RUN mkdir -p $APACHE_RUN_DIR $APACHE_LOCK_DIR $APACHE_LOG_DIR

COPY apache2 /etc/apache2
RUN ln -s /etc/apache2/mods-available/cgi.load /etc/apache2/mods-enabled/cgi.load

COPY backend /backend
COPY frontend /frontend

RUN pip3 install -r /backend/requirements.txt
RUN cd /backend; python3 setup.py develop --script-dir=/var/www/html/cgi-bin
RUN cd /frontend; npm install; npm start && cp -r dist/* /var/www/html
RUN cd /var/www/html/cgi-bin; find . -type f -not -name "*.py" -exec mv {} {}.py ';'
RUN chmod -R 755 /var/www/html

#
# Documentation on the server
#
RUN pydoc3 -w ./backend/; ln backend.html index.html; mkdir /var/www/html/pydoc;for filename in *.html; do mv "$filename" /var/www/html/pydoc/"$filename"; done
RUN npm install -g jsdoc
RUN cd /frontend; jsdoc ./app; mv out /var/www/html/jsdoc

EXPOSE 80

COPY initialise_server.sql /
COPY startup.sh /

RUN chmod +x /startup.sh

ENTRYPOINT ["/startup.sh"]
