FROM postgres

COPY ./db_init_scripts/ /docker-entrypoint-initdb.d/
