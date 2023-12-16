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

module.exports = {
    requestsDatas
}