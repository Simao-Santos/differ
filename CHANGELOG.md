# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- Gray zone visual selector in the frontend. ([#27](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/27))

### Changed
- URL building code to be less error-prone. ([b0958f6a](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/commit/b0958f6a1d8b01a040779cf7e6d75ca9f5a72fd4))

### Removed

### Fixed
- Environment variables usage. ([f6fe0f51](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/commit/f6fe0f510bd2639955fd669b035679916dbe83d8))

## Sprint 3
The main focus of this Sprint was to improve the UI when accessing the different main pages that make up the application. After finishing the feature of the API that saves the necessary information for the frontend to display in a directory, the frontend was improved so that users can now actually see the changes in visually and in the code in a user friendly way.
Some minor adjustments were also done in order to either fix some running aspect of the application or make it more secure.

### Added
- The connection of the backend with the frontend is completed. The frontend is now able to ask all of the required information to the backend and display it accordingly. ([#8](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/8), !24).
- Files for the comparison of the captures in backend. These files were changed to allow the creation of the `.json` file with the information of the pages' code (#10, !21).
- Documentation done with SwaggerAPI (http://localhost:8000/api-docs). Now the backend API of the project is well documented and all the replies and interactions with it can be checkout in that document. ([8b85c6](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/commit/8b85c64507aac1cb43d50b01b79e55ca567ee42b))
- Unit tests to the backend. ([8b85c6](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/commit/8b85c64507aac1cb43d50b01b79e55ca567ee42b))
- Script for the backend to wait for the DB to be ready before starting to run. ([c3100c47](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/commit/c3100c47c076a1ba7dff3b3213f51abfa4d6aa8a))

### Changed
- Removed hardcoded test data and replaced it with real data. ([#8](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/8)).
- Altered the view of code changes to only display a comparison. ([#8](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/8)).
- Project scripts location. ([04f3fab1](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/commit/04f3fab10cb535911158649ebe08306f145daca2))

### Removed
- Database credentials from public files. Now these credentials are kept hidden in a .env file so they are more secure.
- PgAdmin from docker-compose files. ([f67a5347](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/commit/f67a53475d6d43ab25dd31761c251026776dc7e7))

### Fixed
- Fixed the query that fetches information, from the database, relative to the visual comparison component. ([#8](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/8)).
- Files for the generation of the visual captures. The captures being generated sometimes used custom fonts that there was no access to. After these changes, the icons now load correctly (#23, !23).

## Sprint 2

### Added
- Files for setting up PostgreSQL database. In this new version, the website communicates with a database, allowing for storing different types of predefined data ([#19](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/17), [!12](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/merge_requests/5)).
- Files for frontend URLs page, which is where the user can perform actions over its URLs ([#20](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/20)).
- Files for both the [frontend](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/20) and [backend](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/21), enabling users to add and remove URLs from the database ([#2](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/2)). With these additions, users can also capture screenshots of their selected URLs and run the visual comparison between them.
- Files for frontend visual comparison page, which is where the user can see the visual comparison between different captures of a selected URL. This page was redesigned to the point of being considered a new page, but it is not connected to the backend, making it not functional ([#13](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/13)). 
- Files for frontend code comparison page, which is where the user can see the changes in code between different captures of a selected URL's source code. This page was redesigned to the point of being considered a new page. Since the backend implementation for this functionality has not been concluded yet, the page is not currently rendering the described changes. ([#13](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/13)). 

### Changed

### Removed
- Files for old frontend of the web application. Due to a natural misunderstanding between the POs and the team, the application was not being developed exactly as it had been envisioned (see [meetings logs](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/wikis/Meetings-log)). This implied a change in design of the web pages, including the removal of the old one.

### Fixed

- Visual comparison running on Docker. In the previous version the application could not perform this action on the container, but it has been fixed ([#17](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/17), [!5](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/merge_requests/5)). 

## Sprint 1

### Added
- Files for the project to run on Docker ([#11](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/11)).
- Frontend script for 'Changes in code' page ([#13](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/13)).
- Backend code to do visual comparison of HTML documents ([#9](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/9)).

### Changed

### Removed

[Sprint 1]: https://gitlab.com/feup-tbs/ldso2021/t1g1