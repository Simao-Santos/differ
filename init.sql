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

-- Table: public.User
CREATE TABLE public."User"
(
    "Username" character varying(32) COLLATE pg_catalog."default" NOT NULL,
    "Password" text COLLATE pg_catalog."default" NOT NULL,
    CONSTRAINT "Username" PRIMARY KEY ("Username")
)

TABLESPACE pg_default;

ALTER TABLE public."User"
    OWNER to postgres;


-- Table: public.Page
CREATE TABLE public."Page"
(
    "ID" integer NOT NULL,
    "URL" text COLLATE pg_catalog."default",
    "Username" character varying(32) COLLATE pg_catalog."default",
    CONSTRAINT "Page_pkey" PRIMARY KEY ("ID"),
    CONSTRAINT "Username" FOREIGN KEY ("Username")
        REFERENCES public."User" ("Username") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public."Page"
    OWNER to postgres;


-- Table: public.Capture
CREATE TABLE public."Capture"
(
    "ID" integer NOT NULL,
    "PageID" integer,
    "ImageLocation" text COLLATE pg_catalog."default",
    "TextLocation" text COLLATE pg_catalog."default",
    "Date" timestamp with time zone,
    CONSTRAINT "Capture_pkey" PRIMARY KEY ("ID"),
    CONSTRAINT "PageID" FOREIGN KEY ("PageID")
        REFERENCES public."Page" ("ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public."Capture"
    OWNER to postgres;


-- Table: public.Comparison
CREATE TABLE public."Comparison"
(
    "ID" integer NOT NULL,
    "Capture1ID" integer,
    "Capture2ID" integer,
    "ImageLocation" text COLLATE pg_catalog."default",
    "TextLocation" text COLLATE pg_catalog."default",
    CONSTRAINT "Comparison_pkey" PRIMARY KEY ("ID"),
    CONSTRAINT "Capture1ID" FOREIGN KEY ("Capture1ID")
        REFERENCES public."Capture" ("ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION,
    CONSTRAINT "Capture2ID" FOREIGN KEY ("Capture2ID")
        REFERENCES public."Capture" ("ID") MATCH SIMPLE
        ON UPDATE NO ACTION
        ON DELETE NO ACTION
)

TABLESPACE pg_default;

ALTER TABLE public."Comparison"
    OWNER to postgres;