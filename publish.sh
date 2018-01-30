rm index.zip
zip -r --exclude=assets* index.zip *
aws lambda update-function-code --function-name Apoplex --zip-file fileb://index.zip