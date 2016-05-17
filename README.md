## Status: not working

# hdb-js
A simple database with an HTTP interface (REST and non-REST).

## Usage

### Starting the server
```bash
grunt ts && PORT=44511 node bin/www
```

### Interfacing RESTfully with the server
```bash
# Set the value of a key
value="Set SOME/KEY's value to this."
curl --fail -X PUT http://localhost:44511/api/key/SOME/KEY --data-urlencode "value=${value}"
# Get the value of a key
curl --fail -X GET http://localhost:44511/api/key/SOME/KEY
# Output: Set SOME/KEY's value to this.
```
