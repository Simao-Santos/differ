-- Database: postgres
DROP DATABASE IF EXISTS postgres;

CREATE DATABASE postgres
    WITH 
    OWNER = postgres
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.utf8'
    LC_CTYPE = 'en_US.utf8'
    TABLESPACE = pg_default
    CONNECTION LIMIT = -1;
    
\c postgres

-- Table: app_user
CREATE TABLE app_user
(
    username character varying(32) NOT NULL,
    password text NOT NULL,
    PRIMARY KEY (username)
)

TABLESPACE pg_default;

ALTER TABLE app_user
    OWNER to postgres;


-- Table: page
CREATE TABLE page
(
    id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
    url text,
    username character varying(32),
    deleted boolean NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (username)
        REFERENCES app_user (username)
)

TABLESPACE pg_default;

ALTER TABLE page
    OWNER to postgres;


-- Table: capture
CREATE TABLE capture
(
    id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
    page_id integer,
    image_location text,
    text_location text,
    date timestamp with time zone,
    deleted boolean NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (page_id)
        REFERENCES page (id)
)

TABLESPACE pg_default;

ALTER TABLE capture
    OWNER to postgres;


-- Table: comparison
CREATE TABLE comparison
(
    id integer GENERATED ALWAYS AS IDENTITY NOT NULL,
    capture_1_id integer,
    capture_2_id integer,
    image_location text,
    text_location text,
    deleted boolean NOT NULL DEFAULT FALSE,
    PRIMARY KEY (id),
    FOREIGN KEY (capture_1_id)
        REFERENCES capture (id),
    FOREIGN KEY (capture_2_id)
        REFERENCES capture (id)
)

TABLESPACE pg_default;

ALTER TABLE comparison
    OWNER to postgres;