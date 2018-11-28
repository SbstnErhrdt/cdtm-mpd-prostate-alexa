rm index.zip
zip -r --exclude=assets* index.zip *
aws lambda update-function-code --function-name ProState --zip-file fileb://index.zip