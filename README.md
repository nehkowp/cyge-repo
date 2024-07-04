# CYGE App

## Installation

Clone the repository in your folders
```bash
git clone https://github.com/nehkowp/cyge-repo.git 
```
Install librairies and differents dependencies
```bash
cd cyge-repo && npm install
```

You will also need MySQL for the database, you can install it from [here](https://dev.mysql.com/downloads/file/?id=529732 "Download MySQL")

## Configuration

After the install and a complete setup of MySQL, you have to create you own .env file by renaming and modifying the .env.example
```
DB_HOST=localhost
DB_USER=user
DB_PASSWORD=password
DB_NAME=database
```

Then start you app :
```bash
npm start
```


