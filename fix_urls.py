import json
import requests
import pyperclip
from credentials import credentials


host = "https://climate-advisory-board.europa.eu"
old_host = "https://demo-climate-advisory-board.devel4cph.eea.europa.eu"

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
                    # "v": ["Plone Site", 'Document', 'News Item', 'report', 'member'],
                    "v": ["Plone Site", "Document"],
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
    occurrences = blocks.count(old_host)

    if occurrences > 0:
        blocks = blocks.replace(old_host, "")
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
        # print(item['@id'] + ' patched ' + str(occurrences) + " occurrences ")
    else:
        print(item['@id'] + ' nothing to patch')
