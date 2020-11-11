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

INSERT INTO app_user (username, password) VALUES ('default', 'default');


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
    diff_pixels integer,
    total_pixels integer,
    date timestamp with time zone,
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


-- FUNCTIONS
CREATE OR REPLACE FUNCTION delete_page_connections()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
    IF OLD.deleted = FALSE AND NEW.deleted = TRUE THEN
        UPDATE capture
        SET deleted = TRUE
        WHERE page_id = NEW.id AND deleted = FALSE;
	END IF;

	RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION delete_capture_connections()
  RETURNS TRIGGER 
  LANGUAGE PLPGSQL
  AS
$$
BEGIN
    IF OLD.deleted = FALSE AND NEW.deleted = TRUE THEN
        UPDATE comparison
        SET deleted = TRUE
        WHERE (capture_1_id = NEW.id OR capture_2_id = NEW.id) AND deleted = FALSE;
	END IF;

	RETURN NEW;
END;
$$;


-- TRIGGERS
CREATE TRIGGER delete_page_trigger
    BEFORE UPDATE
    ON page
    FOR EACH ROW
    EXECUTE PROCEDURE delete_page_connections();

CREATE TRIGGER delete_capture_trigger
    BEFORE UPDATE
    ON capture
    FOR EACH ROW
    EXECUTE PROCEDURE delete_capture_connections();