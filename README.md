## Prerequisites

// TODO: Add more info

- Netlify CLI (authenticate and link project)
- Node 12


# Setting CORS policy for bucket

The CORS config for the default bucket can be found at [/gcp/bucket-cors-config.json](/gcp/bucket-cors-config.json)

The CORS config can be viewed by running

`gsutil cors get gs://oreon-accounting.appspot.com`

It can be set or updated by running

`gsutil cors set ./gcp/bucket-cors-config.json gs://oreon-accounting.appspot.com`

For more info view [the official GCP docs](https://cloud.google.com/storage/docs/configuring-cors#gsutil)
