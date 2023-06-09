import json
import requests
import pyperclip
from credentials import credentials


host = "https://demo-biodiversity.devel5cph.eea.europa.eu"

old_hosts = [
    'http://localhost:8080',
    'http://backend:8080',
    'http://backend:6081',
    "https://biodiversity.europa.eu/api",
    "https://biodiversity.europa.eu",
]

# Authentication step

tokenFile = open("token.json", "r")
tokenData = json.loads(tokenFile.read())

authToken = tokenData["token"] if "token" in tokenData else None

if not authToken:
    login = requests.post(
        host + "/++api++/@login",
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        json={
            "login": credentials["username"],
            "password": credentials["password"],
        },
    )
    authToken = login.json()["token"]
    _tokenFile = open("token.json", "w")
    _tokenFile.write(json.dumps({"token": authToken}, indent=2))
    _tokenFile.close()

tokenFile.close()

# Fetching items step

itemsFile = open("items.json", "r")
itemsData = json.loads(itemsFile.read())

items = itemsData["items"] if "items" in itemsData else None

if not items:
    querystringRequest = requests.post(
        host + "/++api++/@querystring-search",
        headers={
            "Accept": "application/json",
            "Content-Type": "application/json",
            "Authorization": "Bearer " + authToken,
        },
        json={
            "b_size": "1000",
            "b_start": 0,
            "query": [
                {
                    "i": "portal_type",
                    "o": "plone.app.querystring.operation.selection.any",
                    # "v": ["Document"],
                    "v": ["Plone Site"],
                    # "v": ["bise_factsheet", "Folder"]
                }
            ]
        },
    )

    querystringData = querystringRequest.json()
    items = querystringData["items"]

    _itemsFile = open("items.json", "w")
    _itemsFile.write(json.dumps(querystringData, indent=2))
    _itemsFile.close()

itemsFile.close()

# Update urls step

for item in items:
    url = item["@id"].replace(host, host + "/++api++")
    contentRequest = requests.get(
        url,
        headers={
            "Accept": "application/json",
            "Authorization": "Bearer " + authToken,
        },
    )
    data = contentRequest.json()
    blocks = json.dumps(data["blocks"])
    occurrences = 0

    for old_host in old_hosts:
        current_occurrences = blocks.count(old_host)

        if current_occurrences > 0:
            blocks = blocks.replace(old_host, "")
            occurrences += current_occurrences
            
    if occurrences > 0:
        patch = requests.patch(
            url,
            headers={
                "Accept": "application/json",
                "Content-Type": "application/json",
                "Authorization": "Bearer " + authToken,
            },
            json={"blocks": json.loads(blocks)},
        )
        print(item['@id'] + ' patched ' + str(occurrences) + " occurrences " + patch.text)
    else:
        print(item['@id'] + ' nothing to patch')
