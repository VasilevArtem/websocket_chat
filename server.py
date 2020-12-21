import asyncio
import websockets
import json

STATE = {'value':0}

users = set()
USERS = {}



def user_event():

    return json.dumps({"type": "users", "u_name": list(USERS.values())})

# def user_message():
#     return json.dumps({"type":"message", "message":})


async def reg_users(websocket,pem):

    USERS.update({websocket:pem['values']})

    print(USERS)

async def send_count_users():
    if USERS:
        message = user_event()
        await asyncio.wait([user.send(message) for user in USERS])


async def del_users(websocket):
    del USERS[websocket]
    await send_count_users()

async def send_to_users(message,websocket):
    if USERS:
        message = json.dumps({"type": "message","user": USERS[websocket] ,"value": message})
        await asyncio.wait([user.send(message) for user in USERS])



async def server(websocket,path):
    # await reg_users(websocket)


    try:
        await data(websocket)

    finally:
        await del_users(websocket)
        print(USERS)


async def data(websocket):
    async for message in websocket:
        pem = json.loads(message)
        if pem['action'] == 'reg':
            await reg_users(websocket,pem)
            await send_count_users()
            # print(USERS)
        elif pem['action'] =='getuser':
            await send_count_users()

        elif pem['action'] == 'messages':
            message = pem['values']
            print(message)
            await send_to_users(message,websocket)








start_server = websockets.serve(server,'192.168.0.160',5678)

asyncio.get_event_loop().run_until_complete(start_server)
asyncio.get_event_loop().run_forever()
