# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## Unreleased

### Added
- The connection of the backend with the frontend is completed. The frontend is now able to ask all of the required information to the backend and display it accordingly. ([#8](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/8)).


### Changed
- Removed hardcoded test data and replaced it with real data. ([#8](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/8)).
- Altered the view of code changes to only display a comparison. ([#8](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/8)).
### Removed
- 

### Fixed
- Fixed the query that fetches information, from the database, relative to the visual comparison component. ([#8](https://gitlab.com/feup-tbs/ldso2021/t1g1/-/issues/8)).

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