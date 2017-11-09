SELSMAN 

Scraper Extension, Local Server Model Application Network

SELSMAN has 3 components:

1) A database of your choice (click to run jar or set up through AWS console in browser)

CHOICE A:
  set up your AWS config with the proper IAM credentials, and the data will persist to your aws account's dynamodb table.

CHOICE B:
download the dynamodb-local jar from this link:
Extract the directory, open a terminal in that directory (dynamodb-local) and run this command:

```
java -Djava.library.path=./DynamoDBLocal_lib -jar DynamoDBLocal.jar -sharedDb
```
this starts a local dynamo db server. You don't have to worry about account credentials, and the data is stored right on your machine. If you stop the server,
the data will go away. However, you will find soon that it is easy to repopulate, which is why the local option is a viable one. If necessary, you can create
a simple workflow to publish your local table to a centralized or permanent location.

2) Scraping Extension (chrome extension, javascript. Install by adding code directory to browser)

browser extensions have been around for a while and can perform a wide range of tasks via the chrome browser api. You are probably familiar with extensions that block ads, 
or let you customize the cookies or user agents for requests. Chrome extensions can access windows and tabs, execute scripts to those windows (which can modify their content, think ad block), 
sync data across devices for chrome accounts, and display their own html taking the form of popups or even pages (think postman). This chrome extension has two parts:

a. background script:

the background script is what exeutes when you click the extension's icon in the toolbar. This event, or "action" is referred to as a browser action. On the browser action, our extension will open the urls which contain the links to the most recent test results. The urls for these pages are built from the pipeline name and the test target, for example VALIDATE_TABLET_CN. However, because new results can be published at any time, the most recent report's URL is a randomly generated id, which we have no way of programmatically achieving. With a selenium script, we have to provide credentials to see these reports, which is doable but problematic. With a chrome extension, the background script just opens all the urls in your browser, that already has your credentials stored as a cookie or web token. 

b. the content scripts

Content scripts can be injected via code to any tab or tabs open in a browser. But they can automatically inject by matching certain urls. We will look to match 2 different scripts to 2 kinds of pages. The first page will be that predictable url pattern, with the pipeline and target. This page, we just need to open the report! so we click the proper link. Then we can inject a script to the second pages, predicting the url by using an asterisk in the place of the uuid. This script will grab the failures data, and post them via CORS to our local server. The local dynamodb server from part 1? Not directly. We need a simple local express server to pass the data to the database, because that's still how life works. don't be sad. 

3) The Local Server (node.js, express, HTML, CSS, & Javascript)

Express is an application server for node.js which is easy to use open source and awesome. Lets you create server routes quickly to wire requests and responses. In our server, we connect to the database, and create a few routes. One to post failures. It takes a failure (or list of) retrieved by the content script, and saves it to the database. There is a get route, which retrieves every failure in the database and returns it at as a json list. And a 2nd get route, which returns an html file. the html file is a static file, and it contains a script to call the first get route, and display the data. We can put more javascript functionality to perform pretty much any other task we would like to do. The biggest question become: where are we storing the data, how are we accessing it, and who is it for?



