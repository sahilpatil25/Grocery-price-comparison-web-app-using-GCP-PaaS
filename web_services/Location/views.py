from django.shortcuts import render
from django.http import Http404
from rest_framework.views import APIView
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.http import JsonResponse
from django.core import serializers
from django.conf import settings
import psycopg2
import json
import googlemaps
import responses

# Create your views here.

@api_view(["GET"])
def get_nearby_stores(reqdata):
    try:
        location = reqdata.GET.get('location')
        within = reqdata.GET.get('radius')
        
        gmaps = googlemaps.Client(key='<Your API key>')
        places = gmaps.places_nearby(location=location,
                                  language='en_US',
                                  radius=within,type='grocery_or_supermarket')
        
        origins = [location]
        destinations = []
        placeinfo = []
        
        db_names = { "food city" : "Food City", "walmart" : "Walmart Supercenter", "target" : "Target Grocery", "whole foods" : "Whole Foods Market" }

        for element in places['results']:
            name = element['name']
            name = name.lower()
            filtered_name = ""
            for sname in db_names.keys():
                if sname in name:
                    filtered_name = db_names[sname]
                    break

            if not filtered_name:
                continue

            destinations.append([element['geometry']['location']['lat'],element['geometry']['location']['lng']])
            place = {'name':filtered_name, 'address':element['vicinity']}
            placeinfo.append(place)
        
        matrix = gmaps.distance_matrix(origins,destinations,units="imperial")
        
        for dist,place in zip(matrix['rows'][0]['elements'],placeinfo):
            place['distance'] = dist['distance']['text']
            place['ETA'] = dist['duration']['text']

        return JsonResponse(placeinfo,safe=False)
    except ValueError as e:
        return Response(e.args[0],status.HTTP_400_BAD_REQUEST)

@api_view(["GET"])
def test_autoscaling(reqdata):
    try:
        location = reqdata.GET.get('location')
        within = reqdata.GET.get('radius')
        placeinfo = { 'location': location, 'within': within}
        return JsonResponse(placeinfo,safe=False)
    except ValueError as e:
        return Response(e.args[0],status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def get_product_list(reqdata):
    try:
        body = json.loads(reqdata.body)
        product_info = getItemDetails(body['product_type'],body['stores'])
        return JsonResponse(product_info,safe=False)
    except ValueError as e:
        return Response(e.args[0],status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
def get_comparison(reqdata):
    try:
        body = json.loads(reqdata.body)
        comp_data = comparisionList(body['products'],body['stores'])
        return JsonResponse(comp_data,safe=False)
    except ValueError as e:
        return Response(e.args[0],status.HTTP_400_BAD_REQUEST)

def fetch_from_db(sub_category,store_list):
    item = {'id':'1', 'name':'vicinity'}
    item1 = {'id':'2', 'name': sub_category}
    item_list = []
    item_list.append(item)
    item_list.append(item1)
    return item_list

def getItemDetails(subCategory,shops):
    subCategoryId=0
    itemDetails = list(list())
    itemIds = list()
    availableItems = list()
    dealDetails = list(list())
    items = list(list())
    conn = psycopg2.connect(host="cloud_SQL_IP",database="postgres",user="postgres",password="password")
    cur = conn.cursor()
    shopIds = getShopIds(shops)
    subcategoryCmd = 'SELECT * FROM myschema."sub_categories" where sub_category_name = %s'
    itemCmd = 'select * from myschema.items where sub_category_id = %s'
    dealCmd = 'select * from myschema.deals where ('

    for i in range(len(shopIds)):
        if i==0:
            dealCmd+= (' ( shop_id= \'%s\''%shopIds[i] + ')')
        else:
            dealCmd+= (' OR ( shop_id = \'%s\''%shopIds[i] + ')')

    dealCmd+= ')'
    cur.execute(subcategoryCmd,(subCategory,))
    subCategoryDetails = cur.fetchone()
    subCategoryId = subCategoryDetails[0]

    cur.execute(itemCmd,(subCategoryId,))
    itemDetails = cur.fetchall()
    for row in itemDetails:
        itemIds.append(row[0])

    dealCmd += ' AND ('
    for i in range(len(itemIds)):
        if i==0:
            dealCmd+= (' ( item_id = \'%s\''%itemIds[i] + ')')
        else:
            dealCmd+= (' OR ( item_id = \'%s\''%itemIds[i] + ')')
    dealCmd+= ')'
    cur.execute(dealCmd)
    dealDetails = cur.fetchall()
    cmd = 'select * from myschema.items where '
    for i in range(len(dealDetails)):
        if i==0:
            cmd+= (' ( item_id = %s'%dealDetails[i][2] + ')')
        else:
            cmd+= (' OR ( item_id = %s'%dealDetails[i][2] + ')')
    cur.execute(cmd)
    availableItems = cur.fetchall()
    for row in availableItems:
        items.append({'product_id' : row[0] ,'product_name' : row[1], 'brand' : row[4], 'quantity' : str(row[2])+' '+row[3]})
    conn.close()

    return items

def getShopIds(shops):
    shopIdList = list()
    conn = psycopg2.connect(host="cloud_SQL_IP",database="postgres",user="postgres",password="Cse546@16")
    cur = conn.cursor()
    shopCmd = 'SELECT * FROM myschema.shops where'

    for i in range(len(shops)):
        if i==0:
            shopCmd+= (' ( shop_name = \'%s\''%shops[i] + ')')
        else:
            shopCmd+= (' OR ( shop_name = \'%s\''%shops[i] + ')')

    cur.execute(shopCmd)
    shopDetails = cur.fetchall()
    for row in shopDetails:
        shopIdList.append(row[0])
    conn.close()
    return shopIdList

def comparisionList(itemDict,shopList):
    shopDict = ShopListToDict(shopList)
    itemDetails = list(list())
    comList = list()
    conn = psycopg2.connect(host="cloud_SQL_IP",database="postgres",user="postgres",password="Cse546@16")
    cur = conn.cursor()

    itemIdToSelQuan = dict()
    for i in range(len(itemDict)):
        itemIdToSelQuan.update({'%s'%itemDict[i]['item_id']: itemDict[i]['quantity']})

    productList = itemIdToList(itemDict)

    itemIdToName = dict()
    for i in range(len(productList)):
        itemIdToName.update({'%s'%productList[i][0]: productList[i][1]})

    itemIdToQuantity = dict()
    for i in range(len(productList)):
        itemIdToQuantity.update({'%s'%productList[i][0]: productList[i][2]})

    itemIdToUnit = dict()
    for i in range(len(productList)):
        itemIdToUnit.update({'%s'%productList[i][0]: productList[i][3]})

    itemIdToBrand = dict()
    for i in range(len(productList)):
        itemIdToBrand.update({'%s'%productList[i][0]: productList[i][4]})

    for i in range(len(shopDict)):
        cmd = 'select * from myschema.deals where ( shop_id = %s'%shopDict[i]['shop_id'] +') AND '
        cmd+= '('
        for j in range(len(itemDict)):
            if j==0:
                cmd+= (' ( item_id = %s'%itemDict[j]['item_id'] + ')')
            else:
                cmd+= (' OR ( item_id = %s'%itemDict[j]['item_id'] + ')')
        cmd += ')'

        cur.execute(cmd)
        itemDetails = cur.fetchall()

        totalCost = 0
        purcEnrty = dict()
        purcEnrty['store_name'] = shopDict[i]['shop_name']
        purcEnrty['products'] = list()
        for k in range(len(itemDetails)):
            purcDict=dict()
            purcDict.update({'item_name': itemIdToName[str(itemDetails[k][2])]})
            purcDict.update({'brand': itemIdToBrand[str(itemDetails[k][2])]})
            purcDict.update({'quantity_per_item': str(itemIdToQuantity[str(itemDetails[k][2])]) + ' ' + itemIdToUnit[str(itemDetails[k][2])]})
            purcDict.update({'rate': (itemDetails[k][3])})
            purcDict.update({'quantity_selected': itemIdToSelQuan[str(itemDetails[k][2])]})
            purcDict.update({'price': round((itemDetails[k][3]) * purcDict['quantity_selected'],2)})
            purcDict.update({'unit_price': itemDetails[k][4]})
            purcEnrty['products'].append(purcDict)
            totalCost+= (purcDict['price'])
        purcEnrty['total_cost'] = round(totalCost,2)
        purcEnrty['value_rank'] = 0
        comList.append(purcEnrty)

    comList = sorted(comList, key=lambda i: i['total_cost'])
    rank=0
    for entries in comList:
        entries['value_rank'] = rank
        rank+=1
    return comList

def itemIdToList(itemDict):
    conn = psycopg2.connect(host="cloud_SQL_IP", database="postgres", user="postgres", password="Cse546@16")
    cur = conn.cursor()

    prodCmd = 'select * from myschema.items where '
    for i in range(len(itemDict)):
        if i == 0:
            prodCmd += (' ( item_id = %s' % itemDict[i]['item_id'] + ')')
        else:
            prodCmd += (' OR ( item_id = %s' % itemDict[i]['item_id'] + ')')
    cur.execute(prodCmd)
    proIdNameList = cur.fetchall()
    return proIdNameList

def ShopListToDict(shops):
    shopList = list(dict())
    conn = psycopg2.connect(host="cloud_SQL_IP", database="postgres", user="postgres", password="Cse546@16")
    cur = conn.cursor()
    shopCmd = 'SELECT * FROM myschema.shops where'

    for i in range(len(shops)):
        if i == 0:
            shopCmd += (' ( shop_name = \'%s\'' % shops[i] + ')')
        else:
            shopCmd += (' OR ( shop_name = \'%s\'' % shops[i] + ')')

    cur.execute(shopCmd)
    shopDetails = cur.fetchall()
    for row in shopDetails:
        entry = dict()
        entry['shop_id'] = row[0]
        entry['shop_name'] = row [1]
        shopList.append(entry)
    conn.close()

    return shopList