@app
deepracer-timer

@cdn
@static
@http
get /
get /timer
get /times/:league
get /league/:league

@ws

## Uncomment the following lines to deploy to AWS!
@aws
profile default
region ap-northeast-2
bucket nalbam-mz-arc-deepracer-timer
