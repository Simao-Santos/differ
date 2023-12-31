FROM node:latest

WORKDIR /app/be

COPY package.json package-lock.json ./

# Install postgresql to use wait-for-pg.sh
RUN apt-get update && apt-get install -y postgresql

# Dependencies needed for running Chromium headless
# https://github.com/puppeteer/puppeteer/issues/1345#issuecomment-343538927
RUN apt-get update && apt-get install -y \
  wget \
  unzip \
  fontconfig \
  locales \
  gconf-service \
  libasound2 \
  libatk1.0-0 \
  libc6 \
  libcairo2 \
  libcups2 \
  libdbus-1-3 \
  libexpat1 \
  libfontconfig1 \
  libgcc1 \
  libgconf-2-4 \
  libgdk-pixbuf2.0-0 \
  libglib2.0-0 \
  libgtk-3-0 \
  libnspr4 \
  libpango-1.0-0 \
  libpangocairo-1.0-0 \
  libstdc++6 \
  libx11-6 \
  libx11-xcb1 \
  libxcb1 \
  libxcomposite1 \
  libxcursor1 \
  libxdamage1 \
  libxext6 \
  libxfixes3 \
  libxi6 \
  libxrandr2 \
  libxrender1 \
  libxss1 \
  libxtst6 \
  ca-certificates \
  fonts-liberation \
  libappindicator1 \
  libnss3 \
  lsb-release \
  xdg-utils \
  wget

RUN npm install

COPY . ./

RUN mkdir -p src/public/shots

RUN chmod 777 src/public/shots

# Change the 'wait for postgres' script permissions 
RUN chmod 777 wait-for-pg.sh

# To overcome the "No usable sandbox!" error that prevents Chrome from launching
# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#recommended-enable-user-namespace-cloning
RUN echo 'kernel.unprivileged_userns_clone=1' > /etc/sysctl.d/userns.conf

# This last line requires that the container is started with '--cap-add=SYS_ADMIN' (added to docker-composer)
# https://github.com/puppeteer/puppeteer/issues/3451#issuecomment-523961368

# To overcome the "Running as root without --no-sandbox is not supported" error that prevents Chrome from launching
# The goal is to use another user that is not root
# https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-puppeteer-in-docker
RUN groupadd -r differuser && useradd -r -g differuser differuser \
    && chown differuser:differuser ./

USER differuser

# PROBLEM: by running with differuser, there are permission errors when running this container in a volume
# This is solved with start.sh

# Makes sure the backend is only started when the database is ready
ENTRYPOINT ["./wait-for-pg.sh"]

ENV NODE_ENV production

CMD npm start