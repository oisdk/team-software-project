[![Build Status](https://travis-ci.org/oisdk/team-software-project.svg?branch=master)](https://travis-ci.org/oisdk/team-software-project)

# Table of Contents

* [Intro](#intro)
    * [Audience and Document Scope](#audience-and-document-scope)
* [Database Organisation](#database-organisation)
    * [Access Database from Docker](#how-to-accessing-database-from-docker)
    * [Current Tables in Database](#current-tables-in-the-database)
    * [Table Structures](#table-structures)
    * [Glossary](#glossary)
* [Communication Structure](#communication-structure)
    * [Component & Connector View](#component-connector-view)

# Intro

This is Team 2’s project as part of the CS3305 module in 2018, which is an online version of Monopoly. You can access a live version of this application [here](http://54.186.226.199).

## Audience and Document Scope

This document is part of the larger documentation associated with this project. It is intended to give a high-level overview of the project, targeted at developers new to the project, and at developers currently involved.

For a guide on how to use the application, targeted at end-users, see [the usage document](USAGE.md).

For a more detailed guide on how to get involved and contribute to the project, see [the contributing document](CONTRIBUTING.md).

# Communication Structure

## Component & Connector View

This diagram shows a component & connector view of the system:

![Component & Connector View](documentation-images/component-connector-view.svg)

Clients send requests to apache, which runs the corresponding CGI scripts. These scripts interact with a database and send back a response.

Clients also initialise a Server-sent Events event stream. This starts a script running on the server which polls the database for changes – it sends events back to the client for any changes it finds.

Since the SSE script<sup id="thread-note-source">[1](#thread-note)</sup> is constantly polling, most CGI scripts don’t require a response, and so mostly write to the database, rather than reading from it.

<a id="thread-note">1</a>: This is slightly misleading, as it suggests that there is only one SSE program running. Actually, each client gets its own thread, but they are all running the same program. The client can pass data (e.g. an id) to the SSE script through the query string so that it can behave differently for each client. [↩](#thread-note-source)
