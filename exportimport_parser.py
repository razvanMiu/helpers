import json

host = "http://localhost:8080/bise"

def replace_host(dataString, host):
    dataString = dataString.replace("http://backend:8080/bise", host)
    dataString = dataString.replace("http://backend:6081/bise", host)
    dataString = dataString.replace("https://biodiversity.europa.eu/api", host)
    dataString = dataString.replace("https://biodiversity.europa.eu", host)
    dataString = dataString.replace("https://demo-biodiversity.eea.europa.eu/api", host)
    dataString = dataString.replace("https://demo-biodiversity.eea.europa.eu", host)
    dataString = dataString.replace("/api", host)
    return dataString

# Opening JSON file
f = open('./input.json')

data = json.load(f)

newData = []

for item in data:
    item["@id"] = replace_host(item["@id"], host)
    item["parent"]["@id"] = replace_host(item["parent"]["@id"], host)
    if isinstance(item["language"], str):
        item["language"] = {
            "title": "English",
            "token": "en"
        }
    elif "title" in item["language"]:
        item["language"]["title"] = "English"
        item["language"]["token"] = "en"
    if "blocks" in item:
        blocks = json.dumps(item["blocks"])
        blocks = replace_host(blocks, "")
        item["blocks"] = json.loads(blocks)

with open("./output.json", "w") as outfile:
  json.dump(data, outfile, indent = 2)

# Closing JSON file
f.close()
