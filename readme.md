# BPScrapper
This is a project which log prices of BP. All logs are written in database for safekeeping. Then you can use other programs for visualizing data or just informing yourself about great deals!

# How to use it?
First clone it with:
```sh
git clone https://github.com/Zeptosec/BPScrapper.git
```
Then install modules:
```sh
npm i
```
Setup env file as shown in **.env.example** file and run:
```sh
npm start
```
Then access one of the api links `/api/getprices?pass=yourpass`. For the first time you will get an error, but this will create a collection and a document in your database. Go update that document with correct values in your database and then you can use it normally without errors.
