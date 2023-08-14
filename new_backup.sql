--
-- PostgreSQL database dump
--

-- Dumped from database version 14.8 (Ubuntu 14.8-0ubuntu0.22.04.1)
-- Dumped by pg_dump version 15.3 (Ubuntu 15.3-1.pgdg22.04+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: public; Type: SCHEMA; Schema: -; Owner: postgres
--

-- *not* creating schema, since initdb creates it


ALTER SCHEMA public OWNER TO postgres;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: collab_task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.collab_task (
    id integer NOT NULL,
    title text,
    description text,
    status text,
    image_attachment text,
    file_attachment text,
    audio_attachment text,
    date_attachment date,
    time_attachment timestamp with time zone,
    "user" text,
    username character varying(50)
);


ALTER TABLE public.collab_task OWNER TO postgres;

--
-- Name: task; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.task (
    id integer NOT NULL,
    title text,
    description text,
    assigned_to integer,
    completed boolean,
    username text
);


ALTER TABLE public.task OWNER TO postgres;

--
-- Name: user; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public."user" (
    id integer NOT NULL,
    name text,
    email text
);


ALTER TABLE public."user" OWNER TO postgres;

--
-- Data for Name: collab_task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.collab_task (id, title, description, status, image_attachment, file_attachment, audio_attachment, date_attachment, time_attachment, "user", username) FROM stdin;
1	Sample Task	This is sample task	IN-PROGRESS	\N	\N	\N	\N	\N	\N	\N
2	Sample Task	This is sample task	IN-PROGRESS	\N	\N	\N	\N	\N	\N	\N
3	Sample Task	This is sample task	IN-PROGRESS	\N	\N	\N	\N	\N	\N	\N
\.


--
-- Data for Name: task; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.task (id, title, description, assigned_to, completed, username) FROM stdin;
3	Sample Task	This is a sample task	\N	\N	\N
2	Updated Task Title	This task has been updated	\N	t	\N
1	Sample Task	This is a sample task	2	\N	\N
5	PK	CURD APIS	\N	\N	\N
4	MK	\N	\N	\N	\N
7	pp	UTT	\N	\N	\N
6	RR	oo	4	t	\N
\.


--
-- Data for Name: user; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public."user" (id, name, email) FROM stdin;
1	hemanth	hemanthk1@gmail.com
2	hemanth	hemanthk1@gmail.com
3	UUU	uu@example.com
4	kkk	kk@example.com
5	mmm	mm@example.com
\.


--
-- Name: collab_task collab_task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.collab_task
    ADD CONSTRAINT collab_task_pkey PRIMARY KEY (id);


--
-- Name: task task_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.task
    ADD CONSTRAINT task_pkey PRIMARY KEY (id);


--
-- Name: user user_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public."user"
    ADD CONSTRAINT user_pkey PRIMARY KEY (id);


--
-- Name: SCHEMA public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE USAGE ON SCHEMA public FROM PUBLIC;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

