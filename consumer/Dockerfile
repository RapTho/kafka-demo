# BUILD STAGE

# Node.js 16.13.1
FROM node@sha256:9627b22e9e2e13ee0dbe692d85f3350c082c2b085e4e53114a016143dbc472f2 as builder

WORKDIR /app

COPY ["app.js", "cert.pem", "package.json", "/app/"]

RUN npm install --production


# RUN STAGE

# Node.js 16.13.1-alpine
FROM node@sha256:a2c7f8ebdec79619fba306cec38150db44a45b48380d09603d3602139c5a5f92

WORKDIR /app

COPY --from=builder /app/ .

LABEL author="Raphael Tholl raphael.tholl@ibm.com"

RUN chown -R node:node /app

USER node

EXPOSE 8000

ENTRYPOINT ["node"]

CMD ["app.js"]