[![Build Status](https://travis-ci.org/oisdk/team-software-project.svg?branch=master)](https://travis-ci.org/oisdk/team-software-project)

# Table of Contents

- [Intro](#intro)
    * [Overview](#overview)
    * [Audience and Document Scope](#audience-and-document-scope)
- [Repository Structure](#repository-structure)
- [Communication Structure](#communication-structure)
- [Deployment Structure](#deployment-structure)

# Intro

## Overview

This is Team 2’s project as part of the CS3305 module in 2018, which is an online version of Monopoly. You can access a live version of this application [here](http://54.186.226.199).

## Audience and Document Scope

This document is part of the larger documentation associated with this project. It is intended to give a high-level overview of the project, targeted at developers new to the project, and at developers currently involved.

For a guide on how to use the application, targeted at end-users, see [the usage document](USAGE.md).

For a more detailed guide on how to get involved and contribute to the project, see [the contributing document](CONTRIBUTING.md).

# Repository Structure

The repository is broken down into two sub-sections: `frontend`, which contains the client-side code, and `backend`, which contains the server-side code.

The backend is structured as a python package – to find out more about the backend code, see the [backend readme](/backend/README.rst).

The frontend is structure as a node package – client-side javascript is in <frontend/app>, images are in <frontend/assets>, and html and css are in <frontend/html> and <frontend/css> respectively. For more info on the structure of the frontend code, see [the frontend readme](/frontend/README.md).

# Communication Structure

The following diagram shows a component & connector view of the system:

![Component & Connector View](documentation-images/component-connector-view.svg)

There are two main information flows:

1. Clients send requests to apache (represented by dashed lines in the diagram), which runs the corresponding CGI scripts. These scripts interact with a database and send back a response.

2. Clients also initialise a Server-sent Events event stream (represented by a solid line in the diagram). This starts a script running on the server which polls the database for changes – it sends events back to the client for any changes it finds.

Since the SSE script<sup id="thread-note-source">[1](#thread-note)</sup> is constantly polling, most CGI scripts don’t require a response (except possibly an acknowledgement), and so mostly write to the database, rather than reading from it.

# Deployment Structure

The following diagram shows a deployment view of the project:

![Deployment View](#documentation-images/deployment-view.svg)

# Footnotes

<a id="thread-note">1</a>: This is slightly misleading, as it suggests that there is only one SSE program running. Actually, each client gets its own thread, but they are all running the same program. The client can pass data (e.g. an id) to the SSE script through the query string so that it can behave differently for each client. [↩](#thread-note-source)
