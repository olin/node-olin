# node-olin

Tools for programmatically getting information about Olin college.

**NOTE:** It would be a bad idea to include this module in a live website. Best keep it for command-line tasks only.

```
npm install olin
```

## `olin.networkLogin(username, pass, callback(err, user))`

Log in as a user with username/password. Returns error if invalid, otherwise returns information on user.

## `olin.resolveUsername(username, pass, infousername, callback(err, infouser))`

Returns data on the account of `infousername`. Can be an email account.

## `olin.expandDistributionList(username, pass, list, callback(err, list))`

Expands a Distribution List to get the names of everyone on that list. Can be used to get names of entire classes for example.

