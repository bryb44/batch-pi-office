const axios = require('axios')
const fs = require('fs')
const dotenv = require('dotenv');

dotenv.config();
const envVars = process.env;


const requestsDatas = {
	getOrdersBody: {
        "token": "",
        "site_id": envVars.SITE_ID,
        "endpoint_id": envVars.ENDPOINT_ID,
        "user_id": envVars.USER_ID,
        "fields": [
          "types",
          "delivery.type",
          "state",
          "information",
          "line_item_groups.item_id",
          "line_item_groups.id",
          "line_item_groups.quantity",
          "line_item_groups.index_ranges",
          "line_item_groups.state",
          "line_item_groups.order_item_id",
          "order_items.pricing_details",
          "order_items.quantity",
          "order_items.information",
          "date",
          "pricing_details.currency",
          "endpoint_has_exclusive_lig",
          "line_item_groups.item.features.image",
          "line_item_groups.item.features.name",
          "line_item_groups.item.features.color",
          "line_item_groups.item.features.size",
          "line_item_groups.item.features.ref_produit",
          "line_item_groups.item.features.code_couleur_fournisseur",
          "line_item_groups.item.features.marque",
          "line_item_groups.item.features.taille_generique",
          "line_item_groups.item.features.exclusionretour"
        ],
        "sort": [
          {
            "key": "delivery.type",
            "sort_order": 1
          },
          {
            "key": "endpoint_has_exclusive_lig.440215",
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
            "from": [
              "orchestrating"
            ]
          },
          "types": {
            "in": [
              "ffs"
            ]
          },
          "line_item_group": {
            "state": {
              "from": [
                "placed"
              ],
              "to": "claimed"
            }
          }
        },
        "item_features_lang": "fr",
        "pagination": {
          "limit": 50
        }
      },    
/*getOrdersBody : {
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
            "user_id": envVars.USER_ID,
            "endpoint_id": envVars.ENDPOINT_ID,
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
                "parcels.delivery.origin.endpoint_id": envVars.ENDPOINT_ID,
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
            "user_id": envVars.USER_ID,
            "endpoint_id": envVars.ENDPOINT_ID
            },
            {
            "fields": [
                "parcels.line_item_ids",
                "line_items.state"
            ],
            "filter": {
                "parcels.delivery.destination.endpoint_id": envVars.ENDPOINT_ID,
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
            "user_id": envVars.USER_ID,
            "endpoint_id": envVars.ENDPOINT_ID
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
                "parcels.delivery.destination.endpoint_id": envVars.ENDPOINT_ID,
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
            // "user_id": "",
            // "endpoint_id": ""
            "user_id": envVars.USER_ID,
            "endpoint_id": envVars.ENDPOINT_ID
            }
        ],
        "site_id": envVars.SITE_ID,
        // "site_id": "",
        "token": ""
    },*/
    prepareOrderBody: {
        "endpoint_id": envVars.ENDPOINT_ID,
        "user_id": envVars.USER_ID,
        "line_items": [
          "652941346450d2c4a95c61b5"
        ],
        "site_id": envVars.SITE_ID,
        "token": "35a0985129ff3fd079af93be9ce32a00"
    },
    baseUrl : envVars.BASE_URL,
    sessionVars : {
        token: '',
        userId: envVars.USER_ID,
        endpointId: envVars.ENDPOINT_ID,
        siteId: envVars.SITE_ID,
        pwd: envVars.PASSWORD
    }
}
const datasUsed = []

function refreshVarsToGet () {
    requestsDatas.getOrdersBody.site_id = requestsDatas.sessionVars.siteId;
    requestsDatas.getOrdersBody.token = requestsDatas.sessionVars.token;
    /*requestsDatas.getOrdersBody.bodies.map(body => {
        body.endpoint_id = requestsDatas.sessionVars.endpointId
        body.user_id = requestsDatas.sessionVars.userId
        return body
    })*/
}


async function getToken () {
console.log("token demande")
    await axios.post(`${requestsDatas.baseUrl}/login`, {
        "captcha": "",
        "password": requestsDatas.sessionVars.pwd,
        "site_id": requestsDatas.sessionVars.siteId,
        "user_id": requestsDatas.sessionVars.userId
    }).then((response) => {
//        console.log(response.data)
        console.log("new token : "+ response.data.token);
        requestsDatas.sessionVars.token = response.data.token
        requestsDatas.sessionVars.token = response.data.token
    }).catch(err => {
        //console.log(err)
        getToken()
    })
}

/*
async function getProduct(objectToGet) {
    await axios.get(`${envVars.BASE_URL}/items?{"item_ids":["${objectToGet.articleId}"],"lang":"fr","sales_channel":"${envVars.SALES_CHANNEL}","filters":{"sales_channels":["${envVars.SALES_CHANNEL}"]},"site_id":"${envVars.SITE_ID}","token":"${objectToGet.token}"}=`)
    .then(response => {
        const items =  response.data.items.map(item => {
            return {
                id: item.id || "",
                name: item.features.fr.name || "",
                marque: item.features.fr.marque || "",
                prixAchat: item.features.fr.prix_achat || "",
                prixNet: item.features.fr.prix_net || "",
                pvc: item.features.fr.pvc || ""
            }
        })
        console.log(items)
        fs.appendFileSync('orderItemsLogs.txt', new Date().getHours() + ":" + new Date().getMinutes() + " Order number is :    " + objectToGet.commandeId + "\r\n")
        fs.appendFileSync('orderItemsLogs.txt', new Date().getHours() + ":" + new Date().getMinutes() + " Order taken is :    " + JSON.stringify(items) + "\r\n")
    }).catch(errorGettingProduct => {
        console.log("error wesh" + errorGettingProduct)
    })
}
    */

async function prepareOrder(respId, orderId) {
    // const respIds = response.line_item_ids // e.g. ["652ac0a679f169b03453816f"]
    // if(datasUsed.find(data => data == response.id)) {
    //     datasUsed.push(response.id)
    // }
    // const logs = {
    //     commandeId: response.id,
    //     articleId: response.line_items[0].item_id,
    //     token: requestsDatas.sessionVars.token
    // }
    
    await axios.patch(`${requestsDatas.baseUrl}/v3/line_item_groups`, {
        "endpoint_id": requestsDatas.prepareOrderBody.endpoint_id,
        "from": "placed",
        "to": "claimed",
        "index_ranges": [{"from": 0, "to": 0}],
        "user_id": requestsDatas.prepareOrderBody.user_id,
        //"line_items": respId,
        "order_id": orderId,
        "site_id": requestsDatas.prepareOrderBody.site_id,
        "token": requestsDatas.sessionVars.token
    }).then(async respTakenOrder => {
        console.log('Order Prepared') 
        //getProduct(logs)
    }).catch(err => {
        console.log(err.data)
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
        //console.log(requestsDatas.getOrdersBody)
        await axios.get(`${requestsDatas.baseUrl}/v3/orders`, {
            data: requestsDatas.getOrdersBody
        }
//        await axios.get(`${requestsDatas.baseUrl}/multi/orders`, {
            
        ).then(response => {
//            if(response.data != '') console.log( response.data )
//            console.log(response.data)
            if(response.data.total_orders > 0) { // on a une commande
                //console.log(response.data.orders[0])
                const orderId = response.data.orders[0].id;
                const respId = response.data.orders[0].line_item_groups;
                prepareOrder(respId, orderId)
                // console.log(response.data.orders[0].line_item_groups)
                // const responseMap = response.data.orders
 // previous version               const responseMap = response.data.map(body => body.response)
//                console.log(responseMap)
//                console.log(responseMap[1]);
                
        //         responseMap.forEach(el => {
        //         //console.log(responseMap);    
		// if(el.length > 0) { // on a qqch dans l'objet
        //                 const newOrder = el.filter(obj => !obj.parcels[0]) // ceux qui ont pas delivery.carrier
        //                 newOrder.forEach(order => prepareOrder(order)) // on les prepare
        //             }
        //         })
            }
            
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
                if(err.config && (err.config.url == `${envVars.BASE_URL}/multi/orders` || err.config.url == `${envVars.BASE_URL}/login` || err.cause == 'getaddrinfo')) {
                fs.appendFileSync('orderLogs.txt', new Date().getHours() + ":" + new Date().getMinutes() + "Error3 : server refused connection \r\n")
                    
                getToken()
                } else {
                    console.log(err.response ? err.response : err.cause)
                    console.log(err.hostname)
                    console.log("err.hostname")
                    getToken()
                    return err
                }
                
            }
        }
    }
    
    
    
    
}

getToken();
getOrders();
const interval = setInterval(async function() {
     await getOrders();
}, 1000);


