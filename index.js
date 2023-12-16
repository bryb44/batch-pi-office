const axios = require('axios')
const fs = require('fs')
const requestsDatas = {
    getOrdersBody : {
        "bodies": [
            {
            "fields": [
                "line_items.unique_candidate",
                "line_items.item_id"
            ],
            "sort": [
                {
                "key": "delivery.type",
                "sort_order": 1
                },
                {
                "key": "exclusive_lis",
                "sort_order": -1
                },
                {
                "key": "date",
                "sort_order": 1
                },
                {
                "key": "_id",
                "sort_order": 1
                }
            ],
            "filter": {
                "state": {
                "$in": [
                    "orchestrating"
                ]
                },
                "types": "ffs"
            },
            "line_item_to": "claimed",
            "line_item_from": [
                "placed"
            ],
            "user_id": "fbalavoine",
            "endpoint_id": "440215",
            "limit": 51
            },
            {
            "fields": [
                "parcels.line_item_ids",
                "parcels.documents",
                "parcels.shipment.document_id",
                "parcels.shipment.return_document_id",
                "line_items.id"
            ],
            "filter": {
                "parcels.delivery.origin.endpoint_id": "440215",
                "state": {
                "$in": [
                    "orchestrating",
                    "processing"
                ]
                }
            },
            "parcel_to": "dispatched",
            "parcel_from": [
                "packed"
            ],
            "user_id": "fbalavoine",
            "endpoint_id": "440215"
            },
            {
            "fields": [
                "parcels.line_item_ids",
                "line_items.state"
            ],
            "filter": {
                "parcels.delivery.destination.endpoint_id": "440215",
                "state": {
                "$in": [
                    "orchestrating",
                    "processing"
                ]
                },
                "types": "ckc"
            },
            "parcel_to": "received",
            "parcel_from": [
                "dispatched"
            ],
            "user_id": "fbalavoine",
            "endpoint_id": "440215"
            },
            {
            "fields": [
                "parcels.delivery.origin",
                "parcels.line_item_ids",
                "parcels.shipment.tracking_code",
                "parcels.containers.id",
                "parcels.containers.container_id",
                "parcels.containers.state",
                "parcels.delivery.destination",
                "parcels.documents",
                "line_items.state",
                "line_items.reason",
                "documents",
                "types"
            ],
            "filter": {
                "types": {
                "$in": [
                    "ckc",
                    "ckc_ready"
                ]
                },
                "parcels.delivery.destination.endpoint_id": "440215",
                "state": {
                "$in": [
                    "processing",
                    "orchestrating",
                    "collectable"
                ]
                }
            },
            "parcel_to": "collected",
            "parcel_from": [
                "received",
                "bagged"
            ],
            "user_id": "",
            "endpoint_id": ""
            }
        ],
        "site_id": "",
        "token": ""
    },
    prepareOrderBody: {
        "endpoint_id": "440215",
        "user_id": "fbalavoine",
        "line_items": [
          "652941346450d2c4a95c61b5"
        ],
        "site_id": "c580",
        "token": "35a0985129ff3fd079af93be9ce32a00"
    },
    baseUrl : 'https://api.onestock-retail.com',
    sessionVars : {
        token: '',
        userId: 'fbalavoine',
        endpointId: '440215',
        siteId: 'c580',
        pwd: 'Sp0rt2ooo#'
    }
}
const datasUsed = []

function refreshVarsToGet () {
    requestsDatas.getOrdersBody.site_id = requestsDatas.sessionVars.siteId;
    requestsDatas.getOrdersBody.token = requestsDatas.sessionVars.token;
    requestsDatas.getOrdersBody.bodies.map(body => {
        body.endpoint_id = requestsDatas.sessionVars.endpointId
        body.user_id = requestsDatas.sessionVars.userId
        return body
    })
}


async function getToken () {
    await axios.post(`${requestsDatas.baseUrl}/login`, {
        "captcha": "",
        "password": requestsDatas.sessionVars.pwd,
        "site_id": requestsDatas.sessionVars.siteId,
        "user_id": requestsDatas.sessionVars.userId
    }).then((response) => {
        console.log("new token : "+ response.data.token);
        requestsDatas.sessionVars.token = response.data.token
    }).catch(err => {
        getToken()
    })
}

async function getProduct(objectToGet) {
    await axios.get(`https://api.onestock-retail.com/items?{"item_ids":["${objectToGet.articleId}"],"lang":"fr","sales_channel":"sport2000","filters":{"sales_channels":["sport2000"]},"site_id":"c580","token":"${objectToGet.token}"}=`)
    .then(response => {
        const items =  response.data.items.map(item => {
            return {
                id: item.id,
                name: item.features.fr.name,
                marque: item.features.fr.marque,
                prixAchat: item.features.fr.prix_achat,
                prixNet: item.features.fr.prix_net,
                pvc: item.features.fr.pvc
            }
        })
        console.log(items)
        fs.appendFileSync('orderItemsLogs.txt', new Date().getHours() + ":" + new Date().getMinutes() + " Order number is :    " + objectToGet.commandeId + "\r\n")
        fs.appendFileSync('orderItemsLogs.txt', new Date().getHours() + ":" + new Date().getMinutes() + " Order taken is :    " + JSON.stringify(items) + "\r\n")
    }).catch(errorGettingProduct => console.log("error wesh" + errorGettingProduct))
}

async function prepareOrder(response) {
    const respIds = response.line_item_ids // e.g. ["652ac0a679f169b03453816f"]
    if(datasUsed.find(data => data == response.id)) {
        datasUsed.push(response.id)
	console.log('new commande')
    }
    const logs = {
        commandeId: response.id,
        articleId: response.line_items[0].item_id,
        token: requestsDatas.sessionVars.token
    }

//    console.log("On doit preparer quelque chose, id article : ")
    //console.log(logs.commandeId)
    //refreshVarsToPatch(respIds)
    await axios.patch(`${requestsDatas.baseUrl}/line_items`, {
        "endpoint_id": requestsDatas.prepareOrderBody.endpoint_id,
        "user_id": requestsDatas.prepareOrderBody.user_id,
        "line_items": respIds,
        "site_id": requestsDatas.prepareOrderBody.site_id,
        "token": requestsDatas.sessionVars.token
    }).then(async respTakenOrder => {
        //fs.appendFileSync('orderLogs.txt', new Date().getHours() + ":" + new Date().getMinutes() + "Order Prepared :" + respTakenOrder + "\r\n")
        console.log('Order Prepared') 
        getProduct(logs)
    }).catch(err => {
        if(err.response) {
           console.log("hehe");
        } else {
            throw err
        }
    })
    
}

async function getOrders() {
    try{
        refreshVarsToGet();
        await axios.get(`${requestsDatas.baseUrl}/multi/orders`, {
            data: requestsDatas.getOrdersBody
        }).then(response => {
            //console.log(response.data.map(body => body.response))
            const responseMap = response.data.map(body => body.response)
            responseMap.forEach(el => {
                if(el.length > 0) { // on a qqch dans l'objet
                    const newOrder = el.filter(obj => !obj.parcels[0]) // ceux qui ont pas delivery.carrier
                    newOrder.forEach(order => prepareOrder(order)) // on les prepare
                }
            })
        })
    } catch (err) {
        if(err.response && err.response.data && err.response.data.error == "auth_error"){
            if(err.message == "Request failed with status code 400" && err.name == "AxiosError") {
                fs.appendFileSync('orderLogs.txt', new Date().getHours() + ":" + new Date().getMinutes() + "Error  : Axios erreur, trop d'appel simultanés\r\n")
            } else {
                fs.appendFileSync('orderLogs.txt', new Date().getHours() + ":" + new Date().getMinutes() + "Error1 :" + JSON.stringify(err) + "\r\n")
            }
            

            getToken()
        } else {
            if(err.response && err.response.status && err.response.status == 401) {
                fs.appendFileSync('orderLogs.txt', new Date().getHours() + ":" + new Date().getMinutes() + "Error2 :" + JSON.stringify(err) + "\r\n")

                getToken()
            } else {
                if(err.config && (err.config.url == 'https://api.onestock-retail.com/multi/orders' || err.config.url == 'https://api.onestock-retail.com/login' || err.cause == 'getaddrinfo')) {
                fs.appendFileSync('orderLogs.txt', new Date().getHours() + ":" + new Date().getMinutes() + "Error3 : server refused connection \r\n")
                    
                getToken()
                } else {
                    console.log(err.response)
                    console.log(err.hostname)
                    console.log("err.hostname")
                    throw err
                }
                
            }
        }
    }
    
    
    
    
}

getToken();
getOrders();
const interval = setInterval(async function() {
     await getOrders();
}, 250);


